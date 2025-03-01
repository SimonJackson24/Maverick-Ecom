import { gql } from '@apollo/client';

export const NEWSLETTER_TYPES = gql`
  input NewsletterPreferencesInput {
    product_updates: Boolean!
    scent_news: Boolean!
    special_offers: Boolean!
    sustainability: Boolean!
  }

  input SubscribeToNewsletterInput {
    email: String!
    preferences: NewsletterPreferencesInput!
  }

  type NewsletterSubscriptionResult {
    success: Boolean!
    message: String
    subscription_id: ID
  }

  type NewsletterPreferences {
    product_updates: Boolean!
    scent_news: Boolean!
    special_offers: Boolean!
    sustainability: Boolean!
    last_updated: String!
  }

  type NewsletterSubscription {
    id: ID!
    email: String!
    preferences: NewsletterPreferences!
    confirmed: Boolean!
    created_at: String!
    updated_at: String!
  }

  extend type Mutation {
    subscribeToNewsletter(input: SubscribeToNewsletterInput!): NewsletterSubscriptionResult!
    updateNewsletterPreferences(
      subscription_id: ID!
      preferences: NewsletterPreferencesInput!
    ): NewsletterSubscriptionResult!
    unsubscribeFromNewsletter(subscription_id: ID!): NewsletterSubscriptionResult!
    confirmNewsletterSubscription(token: String!): NewsletterSubscriptionResult!
  }

  extend type Query {
    newsletterSubscription(subscription_id: ID!): NewsletterSubscription
  }
`;

export const SUBSCRIBE_TO_NEWSLETTER = gql`
  mutation SubscribeToNewsletter($input: SubscribeToNewsletterInput!) {
    subscribeToNewsletter(input: $input) {
      success
      message
      subscription_id
    }
  }
`;

export const UPDATE_NEWSLETTER_PREFERENCES = gql`
  mutation UpdateNewsletterPreferences(
    $subscription_id: ID!
    $preferences: NewsletterPreferencesInput!
  ) {
    updateNewsletterPreferences(
      subscription_id: $subscription_id
      preferences: $preferences
    ) {
      success
      message
    }
  }
`;

export const UNSUBSCRIBE_FROM_NEWSLETTER = gql`
  mutation UnsubscribeFromNewsletter($subscription_id: ID!) {
    unsubscribeFromNewsletter(subscription_id: $subscription_id) {
      success
      message
    }
  }
`;

export const CONFIRM_NEWSLETTER_SUBSCRIPTION = gql`
  mutation ConfirmNewsletterSubscription($token: String!) {
    confirmNewsletterSubscription(token: $token) {
      success
      message
    }
  }
`;

export const GET_NEWSLETTER_SUBSCRIPTION = gql`
  query GetNewsletterSubscription($subscription_id: ID!) {
    newsletterSubscription(subscription_id: $subscription_id) {
      id
      email
      preferences {
        product_updates
        scent_news
        special_offers
        sustainability
        last_updated
      }
      confirmed
      created_at
      updated_at
    }
  }
`;
