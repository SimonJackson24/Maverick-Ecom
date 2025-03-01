import { gql } from '@apollo/client';

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
