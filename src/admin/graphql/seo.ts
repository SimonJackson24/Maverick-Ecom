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

export const GET_SEO_SETTINGS = gql`
  query GetSeoSettings {
    seoSettings {
      defaultTitle
      defaultDescription
      defaultKeywords
      robotsTxt
      sitemapEnabled
      canonicalUrlsEnabled
      socialImage
      googleVerification
      bingVerification
      breadcrumbs {
        enabled
        separator
        homepageTitle
      }
      contentAnalysis {
        enabled
        keywordDensity
        readabilityAnalysis
        seoScore
        focusKeywordSuggestions
      }
      localSeo {
        enabled
        businessType
        businessName
        address {
          streetAddress
          addressLocality
          addressRegion
          postalCode
          addressCountry
        }
      }
    }
  }
`;

export const UPDATE_SEO_SETTINGS = gql`
  mutation UpdateSeoSettings($input: SeoSettingsInput!) {
    updateSeoSettings(input: $input) {
      defaultTitle
      defaultDescription
      defaultKeywords
      robotsTxt
      sitemapEnabled
      canonicalUrlsEnabled
      socialImage
      googleVerification
      bingVerification
    }
  }
`;

export const RUN_SEO_ANALYSIS = gql`
  mutation RunSeoAnalysis($url: String!) {
    runSeoAnalysis(url: $url) {
      url
      readabilityScore
      wordCount
      keywordDensity {
        keyword
        density
      }
      headings {
        h1
        h2
        h3
      }
      metaTags {
        title
        description
        keywords
        ogTitle
        ogDescription
        ogImage
      }
      issues {
        severity
        message
        category
      }
    }
  }
`;
