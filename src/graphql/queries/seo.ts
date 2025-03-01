import { gql } from '@apollo/client';

export const GET_SEO_METRICS = gql`
  query GetSeoMetrics {
    seoMetrics {
      overallScore
      scoreTrend
      contentHealthScore
      contentHealthTrend
      metaTagScore
      metaTagTrend
      urlScore
      urlTrend
      keywordPerformance {
        id
        keyword
        position
        trend
        volume
        difficulty
        relevance
        lastChecked
      }
      contentHealth {
        id
        url
        title
        wordCount
        readabilityScore
        keywordDensity
        issues
      }
      metaTags {
        id
        url
        title
        description
        keywords
        status
        issues
      }
      urls {
        id
        currentUrl
        targetUrl
        type
        status
        lastChecked
      }
      issues {
        id
        type
        message
        url
        component
      }
    }
  }
`;
