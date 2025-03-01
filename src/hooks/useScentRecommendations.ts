import { useQuery, useMutation } from '@apollo/client';
import {
  GET_SIMILAR_SCENTS,
  GET_PERSONALIZED_RECOMMENDATIONS,
  TRACK_SCENT_INTERACTION,
} from '../graphql/scent';
import { Product } from '../types/product';
import { useAuth } from './useAuth';

interface RecommendationOptions {
  limit?: number;
  includeExplanations?: boolean;
}

interface ScentInteraction {
  productId: string;
  action: 'view' | 'like' | 'purchase';
}

export function useScentRecommendations() {
  const { user } = useAuth();
  
  const {
    loading: similarLoading,
    error: similarError,
    data: similarData,
    refetch: refetchSimilar,
  } = useQuery(GET_SIMILAR_SCENTS, {
    skip: true, // Only fetch when explicitly called
  });

  const {
    loading: personalizedLoading,
    error: personalizedError,
    data: personalizedData,
    refetch: refetchPersonalized,
  } = useQuery(GET_PERSONALIZED_RECOMMENDATIONS, {
    skip: !user, // Only fetch for logged-in users
  });

  const [trackInteraction] = useMutation(TRACK_SCENT_INTERACTION);

  const getSimilarScents = async (
    productId: string,
    options: RecommendationOptions = {}
  ) => {
    try {
      const { data } = await refetchSimilar({
        productId,
        limit: options.limit,
      });
      return data.similarScents.items;
    } catch (error) {
      console.error('Error fetching similar scents:', error);
      return [];
    }
  };

  const getPersonalizedRecommendations = async (
    options: RecommendationOptions = {}
  ) => {
    if (!user) {
      console.warn('User must be logged in to get personalized recommendations');
      return [];
    }

    try {
      const { data } = await refetchPersonalized({
        limit: options.limit,
      });
      return data.personalizedRecommendations.items;
    } catch (error) {
      console.error('Error fetching personalized recommendations:', error);
      return [];
    }
  };

  const trackScentInteraction = async (interaction: ScentInteraction) => {
    if (!user) {
      console.warn('User must be logged in to track interactions');
      return;
    }

    try {
      await trackInteraction({
        variables: {
          input: {
            ...interaction,
            userId: user.id,
            timestamp: new Date().toISOString(),
          },
        },
      });
    } catch (error) {
      console.error('Error tracking scent interaction:', error);
    }
  };

  return {
    // Queries
    getSimilarScents,
    getPersonalizedRecommendations,
    
    // Mutations
    trackScentInteraction,
    
    // Loading states
    isSimilarLoading: similarLoading,
    isPersonalizedLoading: personalizedLoading,
    
    // Errors
    similarError,
    personalizedError,
    
    // Raw data
    similarScents: similarData?.similarScents.items || [],
    personalizedRecommendations: personalizedData?.personalizedRecommendations.items || [],
  };
}
