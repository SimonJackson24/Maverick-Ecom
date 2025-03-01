import { gql } from '@apollo/client';
import { apolloClient } from '../../lib/apollo';
import { 
  ScentAttribute, 
  ScentRule, 
  SeasonalMapping,
  ScentAttributeInput,
  ScentRuleInput
} from '../types/scent';

export class ScentManagementService {
  static async getScentAttributes() {
    const { data } = await apolloClient.query({
      query: gql`
        query GetScentAttributes {
          scentAttributes {
            id
            name
            type
            intensity
            category
            description
            relatedNotes
          }
        }
      `
    });

    return data.scentAttributes;
  }

  static async createScentAttribute(input: ScentAttributeInput) {
    const { data } = await apolloClient.mutate({
      mutation: gql`
        mutation CreateScentAttribute($input: ScentAttributeInput!) {
          createScentAttribute(input: $input) {
            id
            name
            type
          }
        }
      `,
      variables: { input }
    });

    return data.createScentAttribute;
  }

  static async updateScentAttribute(id: string, input: Partial<ScentAttributeInput>) {
    const { data } = await apolloClient.mutate({
      mutation: gql`
        mutation UpdateScentAttribute($id: ID!, $input: ScentAttributeInput!) {
          updateScentAttribute(id: $id, input: $input) {
            id
            name
            type
          }
        }
      `,
      variables: { id, input }
    });

    return data.updateScentAttribute;
  }

  static async getRecommendationRules() {
    const { data } = await apolloClient.query({
      query: gql`
        query GetRecommendationRules {
          recommendationRules {
            id
            name
            description
            conditions {
              attribute
              operator
              value
            }
            priority
            isActive
          }
        }
      `
    });

    return data.recommendationRules;
  }

  static async createRecommendationRule(input: ScentRuleInput) {
    const { data } = await apolloClient.mutate({
      mutation: gql`
        mutation CreateRecommendationRule($input: ScentRuleInput!) {
          createRecommendationRule(input: $input) {
            id
            name
            isActive
          }
        }
      `,
      variables: { input }
    });

    return data.createRecommendationRule;
  }

  static async updateSeasonalMapping(mappings: SeasonalMapping[]) {
    const { data } = await apolloClient.mutate({
      mutation: gql`
        mutation UpdateSeasonalMapping($mappings: [SeasonalMappingInput!]!) {
          updateSeasonalMapping(mappings: $mappings) {
            success
            message
          }
        }
      `,
      variables: { mappings }
    });

    return data.updateSeasonalMapping;
  }

  static async getRecommendationAnalytics(dateRange: { start: Date; end: Date }) {
    const { data } = await apolloClient.query({
      query: gql`
        query GetRecommendationAnalytics($dateRange: DateRangeInput!) {
          recommendationAnalytics(dateRange: $dateRange) {
            rulePerformance {
              ruleId
              conversions
              impressions
              clickThroughRate
            }
            topPerformingScents {
              scentId
              name
              purchaseRate
              averageOrderValue
            }
            seasonalTrends {
              season
              popularScents
              averageIntensity
            }
          }
        }
      `,
      variables: { dateRange }
    });

    return data.recommendationAnalytics;
  }

  static async validateScentCombination(notes: string[]) {
    const { data } = await apolloClient.query({
      query: gql`
        query ValidateScentCombination($notes: [String!]!) {
          validateScentCombination(notes: $notes) {
            isValid
            compatibilityScore
            suggestions {
              note
              reason
            }
          }
        }
      `,
      variables: { notes }
    });

    return data.validateScentCombination;
  }
}
