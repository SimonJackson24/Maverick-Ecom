import { gql } from '@apollo/client';

export const GET_ANALYTICS_SETTINGS = gql`
  query GetAnalyticsSettings {
    analyticsSettings {
      enableGoogleAnalytics
      googleAnalyticsId
      enableHeatmaps
      trackUserBehavior
      anonymizeIp
      enableEcommerce
      enableConversionTracking
      enableABTesting
      maxConcurrentTests
      trackingDomains
      excludedPaths
      customDimensions
      conversionGoals
      sampleRate
      sessionTimeout
      crossDomainTracking
      userIdTracking
    }
  }
`;
