import { gql } from '@apollo/client';

export const ANALYTICS_TYPES = gql`
  type AnalyticsSettings {
    enableGoogleAnalytics: Boolean!
    googleAnalyticsId: String
    enableHeatmaps: Boolean!
    trackUserBehavior: Boolean!
    anonymizeIp: Boolean!
    enableEcommerce: Boolean!
    enableConversionTracking: Boolean!
    enableABTesting: Boolean!
    maxConcurrentTests: Int!
    trackingDomains: [String!]!
    excludedPaths: [String!]!
    customDimensions: [String!]!
    conversionGoals: [String!]!
    sampleRate: Int!
    sessionTimeout: Int!
    crossDomainTracking: Boolean!
    userIdTracking: Boolean!
  }

  input AnalyticsSettingsInput {
    enableGoogleAnalytics: Boolean
    googleAnalyticsId: String
    enableHeatmaps: Boolean
    trackUserBehavior: Boolean
    anonymizeIp: Boolean
    enableEcommerce: Boolean
    enableConversionTracking: Boolean
    enableABTesting: Boolean
    maxConcurrentTests: Int
    trackingDomains: [String!]
    excludedPaths: [String!]
    customDimensions: [String!]
    conversionGoals: [String!]
    sampleRate: Int
    sessionTimeout: Int
    crossDomainTracking: Boolean
    userIdTracking: Boolean
  }
`;
