import { gql } from '@apollo/client';
import { apolloClient } from '../../lib/apollo';
import {
  PaymentConfig,
  ShippingConfig,
  TaxConfig,
  EmailTemplate,
  APIConfig
} from '../types/configuration';

export class ConfigurationService {
  // Payment Configuration
  static async getPaymentConfig() {
    const { data } = await apolloClient.query({
      query: gql`
        query GetPaymentConfig {
          paymentConfig {
            providers {
              id
              name
              isEnabled
              apiKeys {
                test
                live
              }
              supportedMethods
            }
            currencies {
              code
              rate
              isDefault
            }
            taxSettings {
              includesTax
              calculateTaxBasedOn
            }
          }
        }
      `
    });

    return data.paymentConfig;
  }

  static async updatePaymentConfig(config: Partial<PaymentConfig>) {
    const { data } = await apolloClient.mutate({
      mutation: gql`
        mutation UpdatePaymentConfig($config: PaymentConfigInput!) {
          updatePaymentConfig(config: $config) {
            success
            message
          }
        }
      `,
      variables: { config }
    });

    return data.updatePaymentConfig;
  }

  // Shipping Configuration
  static async getShippingConfig() {
    const { data } = await apolloClient.query({
      query: gql`
        query GetShippingConfig {
          shippingConfig {
            methods {
              id
              name
              isEnabled
              pricing {
                type
                baseRate
                conditions {
                  type
                  value
                  adjustment
                }
              }
            }
            zones {
              id
              name
              countries
              methods
            }
            restrictions {
              minOrderValue
              maxWeight
              restrictedItems
            }
          }
        }
      `
    });

    return data.shippingConfig;
  }

  static async updateShippingConfig(config: Partial<ShippingConfig>) {
    const { data } = await apolloClient.mutate({
      mutation: gql`
        mutation UpdateShippingConfig($config: ShippingConfigInput!) {
          updateShippingConfig(config: $config) {
            success
            message
          }
        }
      `,
      variables: { config }
    });

    return data.updateShippingConfig;
  }

  // Tax Configuration
  static async getTaxConfig() {
    const { data } = await apolloClient.query({
      query: gql`
        query GetTaxConfig {
          taxConfig {
            rules {
              id
              country
              state
              rate
              productCategories
            }
            exemptions {
              type
              conditions
            }
            calculationSettings {
              roundingMethod
              displaySettings
            }
          }
        }
      `
    });

    return data.taxConfig;
  }

  static async updateTaxConfig(config: Partial<TaxConfig>) {
    const { data } = await apolloClient.mutate({
      mutation: gql`
        mutation UpdateTaxConfig($config: TaxConfigInput!) {
          updateTaxConfig(config: $config) {
            success
            message
          }
        }
      `,
      variables: { config }
    });

    return data.updateTaxConfig;
  }

  // Email Templates
  static async getEmailTemplates() {
    const { data } = await apolloClient.query({
      query: gql`
        query GetEmailTemplates {
          emailTemplates {
            id
            name
            subject
            content
            variables
            isActive
          }
        }
      `
    });

    return data.emailTemplates;
  }

  static async updateEmailTemplate(id: string, template: Partial<EmailTemplate>) {
    const { data } = await apolloClient.mutate({
      mutation: gql`
        mutation UpdateEmailTemplate($id: ID!, $template: EmailTemplateInput!) {
          updateEmailTemplate(id: $id, template: $template) {
            id
            name
            isActive
          }
        }
      `,
      variables: { id, template }
    });

    return data.updateEmailTemplate;
  }

  // API Configuration
  static async getAPIConfig() {
    const { data } = await apolloClient.query({
      query: gql`
        query GetAPIConfig {
          apiConfig {
            keys {
              id
              name
              permissions
              lastUsed
            }
            webhooks {
              id
              url
              events
              isActive
            }
            rateLimits {
              endpoint
              limit
              window
            }
          }
        }
      `
    });

    return data.apiConfig;
  }

  static async updateAPIConfig(config: Partial<APIConfig>) {
    const { data } = await apolloClient.mutate({
      mutation: gql`
        mutation UpdateAPIConfig($config: APIConfigInput!) {
          updateAPIConfig(config: $config) {
            success
            message
          }
        }
      `,
      variables: { config }
    });

    return data.updateAPIConfig;
  }

  // System Health Check
  static async getSystemHealth() {
    const { data } = await apolloClient.query({
      query: gql`
        query GetSystemHealth {
          systemHealth {
            services {
              name
              status
              latency
            }
            resources {
              cpu
              memory
              disk
            }
            queues {
              name
              size
              processingRate
            }
            lastBackup {
              timestamp
              status
              size
            }
          }
        }
      `
    });

    return data.systemHealth;
  }
}
