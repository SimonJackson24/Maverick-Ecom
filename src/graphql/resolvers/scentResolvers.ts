import { ApolloError } from 'apollo-server-errors';
import { scentRecommendationService } from '../../services/recommendations/scentRecommendations';
import type { 
  ScentProfile,
  CustomerScentPreferences,
  ScentCategory 
} from '../../types/scent';

export const scentResolvers = {
  Query: {
    async product(_, { sku }, { dataSources }) {
      try {
        const product = await dataSources.products.getProductBySku(sku);
        return {
          ...product,
          scent_profile: await buildScentProfile(product, dataSources),
          similar_products: await getSimilarProducts(product, dataSources)
        };
      } catch (error) {
        throw new ApolloError('Error fetching product scent data', 'SCENT_DATA_ERROR');
      }
    },

    async scentCategories(_, __, { dataSources }) {
      try {
        return await dataSources.scents.getScentCategories();
      } catch (error) {
        throw new ApolloError('Error fetching scent categories', 'SCENT_CATEGORIES_ERROR');
      }
    },

    async customerScentPreferences(_, __, { dataSources, currentUser }) {
      if (!currentUser) {
        throw new ApolloError('User not authenticated', 'AUTHENTICATION_ERROR');
      }

      try {
        return await dataSources.customers.getCustomerScentPreferences(currentUser.id);
      } catch (error) {
        throw new ApolloError('Error fetching customer scent preferences', 'PREFERENCES_ERROR');
      }
    }
  },

  Mutation: {
    async updateCustomerScentPreferences(_, { input }, { dataSources, currentUser }) {
      if (!currentUser) {
        throw new ApolloError('User not authenticated', 'AUTHENTICATION_ERROR');
      }

      try {
        const updatedPreferences = await dataSources.customers.updateScentPreferences(
          currentUser.id,
          input
        );

        return {
          success: true,
          customer: {
            id: currentUser.id,
            scent_preferences: updatedPreferences
          }
        };
      } catch (error) {
        throw new ApolloError('Error updating scent preferences', 'UPDATE_PREFERENCES_ERROR');
      }
    }
  }
};

async function buildScentProfile(product: any, dataSources): Promise<ScentProfile> {
  const [primaryNotes, middleNotes, baseNotes] = await Promise.all([
    dataSources.scents.getNotesByIds(product.primary_notes),
    dataSources.scents.getNotesByIds(product.middle_notes),
    dataSources.scents.getNotesByIds(product.base_notes)
  ]);

  return {
    primary_notes: primaryNotes,
    middle_notes: middleNotes,
    base_notes: baseNotes,
    intensity: product.scent_intensity,
    mood: product.scent_mood,
    season: product.seasonal_recommendation
  };
}

async function getSimilarProducts(product: any, dataSources) {
  // Get base similar products from Adobe Commerce
  const similarProducts = await dataSources.products.getSimilarProducts(product.sku);

  // Get scent profiles for all similar products
  const productsWithProfiles = await Promise.all(
    similarProducts.map(async (similarProduct) => ({
      ...similarProduct,
      scent_profile: await buildScentProfile(similarProduct, dataSources)
    }))
  );

  // Use our recommendation service to calculate match scores and sort products
  const sourceProfile = await buildScentProfile(product, dataSources);
  const recommendations = scentRecommendationService.findComplementaryScents(
    sourceProfile,
    productsWithProfiles.map(p => p.scent_profile)
  );

  // Merge recommendations with product data and sort by score
  return {
    items: productsWithProfiles
      .map((product, index) => ({
        ...product,
        match_score: recommendations[index].complementary_score,
        match_reason: recommendations[index].match_reason
      }))
      .sort((a, b) => b.match_score - a.match_score)
  };
}
