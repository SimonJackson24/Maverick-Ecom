import { gql } from '@apollo/client';

export const GET_INTEGRATION_SETTINGS = gql`
  query GetIntegrationSettings {
    integrationSettings {
      # Payment Integrations
      stripeEnabled
      stripeApiKey
      stripeWebhookSecret
      
      # Currency Settings
      currency
      currencySymbol
      
      # UK Shipping Providers
      royalMailEnabled
      royalMailApiKey
      royalMailAccountNumber
      dpdEnabled
      dpdApiKey
      dpdAccountNumber
      hermesEnabled
      hermesApiKey
      hermesAccountNumber

      # WhatsApp Integration
      whatsappEnabled
      whatsappApiKey
      whatsappPhoneNumber
      whatsappTemplateNamespace

      # Email Service Providers
      mailchimpEnabled
      mailchimpApiKey
      mailchimpListId
      sendgridEnabled
      sendgridApiKey

      # Analytics & Tracking
      googleAnalyticsEnabled
      googleAnalyticsId
      facebookPixelEnabled
      facebookPixelId
      hotjarEnabled
      hotjarSiteId

      # Social Media
      instagramEnabled
      instagramAccessToken
      facebookEnabled
      facebookAccessToken
      pinterestEnabled
      pinterestAccessToken

      # Reviews & Ratings
      judgeEnabled
      judgeApiKey
      trustpilotEnabled
      trustpilotApiKey

      # Tax Calculation
      vatEnabled
      vatNumber
      vatRate
    }
  }
`;

export const UPDATE_INTEGRATION_SETTINGS = gql`
  mutation UpdateIntegrationSettings($input: IntegrationSettingsInput!) {
    updateIntegrationSettings(input: $input) {
      success
      message
      settings {
        # Payment Integrations
        stripeEnabled
        stripeApiKey
        stripeWebhookSecret
        
        # Currency Settings
        currency
        currencySymbol
        
        # UK Shipping Providers
        royalMailEnabled
        royalMailApiKey
        royalMailAccountNumber
        dpdEnabled
        dpdApiKey
        dpdAccountNumber
        hermesEnabled
        hermesApiKey
        hermesAccountNumber

        # WhatsApp Integration
        whatsappEnabled
        whatsappApiKey
        whatsappPhoneNumber
        whatsappTemplateNamespace

        # Email Service Providers
        mailchimpEnabled
        mailchimpApiKey
        mailchimpListId
        sendgridEnabled
        sendgridApiKey

        # Analytics & Tracking
        googleAnalyticsEnabled
        googleAnalyticsId
        facebookPixelEnabled
        facebookPixelId
        hotjarEnabled
        hotjarSiteId

        # Social Media
        instagramEnabled
        instagramAccessToken
        facebookEnabled
        facebookAccessToken
        pinterestEnabled
        pinterestAccessToken

        # Reviews & Ratings
        judgeEnabled
        judgeApiKey
        trustpilotEnabled
        trustpilotApiKey

        # Tax Calculation
        vatEnabled
        vatNumber
        vatRate
      }
    }
  }
`;
