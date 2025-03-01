import { gql } from '@apollo/client';

export const UPDATE_ANALYTICS_SETTINGS = gql`
  mutation UpdateAnalyticsSettings($input: AnalyticsSettingsInput!) {
    updateAnalyticsSettings(input: $input) {
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
