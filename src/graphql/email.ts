import { gql } from '@apollo/client';

export const EMAIL_TYPES = gql`
  type EmailTemplate {
    id: ID!
    name: String!
    subject: String!
    content: String!
    category: EmailCategory!
    version: String!
    createdAt: String!
    updatedAt: String!
  }

  enum EmailCategory {
    NEWSLETTER
    ABANDONED_CART
    WELCOME_SERIES
    PRODUCT_LAUNCH
    SPECIAL_OFFER
    REENGAGEMENT
  }

  type EmailCampaign {
    id: ID!
    name: String!
    type: CampaignType!
    templateId: String!
    segment: UserSegment!
    startDate: String!
    endDate: String
    status: CampaignStatus!
    metrics: CampaignMetrics!
  }

  enum CampaignType {
    NEWSLETTER
    ABANDONED_CART
    WELCOME_SERIES
    PRODUCT_LAUNCH
    SPECIAL_OFFER
    REENGAGEMENT
  }

  enum CampaignStatus {
    DRAFT
    SCHEDULED
    ACTIVE
    PAUSED
    COMPLETED
  }

  type UserSegment {
    id: ID!
    name: String!
    criteria: [SegmentCriteria!]!
  }

  type SegmentCriteria {
    field: String!
    operator: String!
    value: String!
  }

  type CampaignMetrics {
    sent: Int!
    delivered: Int!
    opened: Int!
    clicked: Int!
    converted: Int!
    unsubscribed: Int!
    bounced: Int!
    revenue: Float!
  }

  type EmailTestVariant {
    id: ID!
    templateId: String!
    subject: String!
    content: String!
    metrics: TestVariantMetrics!
  }

  type TestVariantMetrics {
    sent: Int!
    opened: Int!
    clicked: Int!
    converted: Int!
    revenue: Float!
  }

  input CreateTemplateInput {
    name: String!
    subject: String!
    content: String!
    category: EmailCategory!
    version: String!
  }

  input CreateCampaignInput {
    name: String!
    type: CampaignType!
    templateId: String!
    segment: UserSegmentInput!
    startDate: String!
    endDate: String
  }

  input UserSegmentInput {
    name: String!
    criteria: [SegmentCriteriaInput!]!
  }

  input SegmentCriteriaInput {
    field: String!
    operator: String!
    value: String!
  }

  input CreateTestInput {
    name: String!
    variants: [EmailVariantInput!]!
    startDate: String!
    endDate: String
  }

  input EmailVariantInput {
    templateId: String!
    subject: String!
    content: String!
    personalization: PersonalizationConfigInput!
  }

  input PersonalizationConfigInput {
    recommendationCount: Int!
    showScentProfile: Boolean!
    includeSeasonalContent: Boolean!
    showRelatedProducts: Boolean!
    contentStyle: ContentStyle!
  }

  enum ContentStyle {
    MINIMAL
    DETAILED
    VISUAL
  }

  type Query {
    emailTemplate(id: ID!): EmailTemplate
    emailTemplates(category: EmailCategory): [EmailTemplate!]!
    campaign(id: ID!): EmailCampaign
    campaigns(status: CampaignStatus): [EmailCampaign!]!
    campaignMetrics(id: ID!): CampaignMetrics!
    emailTest(id: ID!): [EmailTestVariant!]!
    emailTestResults(id: ID!): [TestVariantMetrics!]!
  }

  type Mutation {
    createEmailTemplate(input: CreateTemplateInput!): EmailTemplate!
    updateEmailTemplate(id: ID!, input: CreateTemplateInput!): EmailTemplate!
    deleteEmailTemplate(id: ID!): Boolean!
    
    createCampaign(input: CreateCampaignInput!): EmailCampaign!
    updateCampaign(id: ID!, input: CreateCampaignInput!): EmailCampaign!
    pauseCampaign(id: ID!): EmailCampaign!
    resumeCampaign(id: ID!): EmailCampaign!
    deleteCampaign(id: ID!): Boolean!
    
    createEmailTest(input: CreateTestInput!): [EmailTestVariant!]!
    endEmailTest(id: ID!): EmailTestVariant! # Returns winning variant
  }
`;

export const GET_EMAIL_TEMPLATE = gql`
  query GetEmailTemplate($id: ID!) {
    emailTemplate(id: $id) {
      id
      name
      subject
      content
      category
      version
      createdAt
      updatedAt
    }
  }
`;

export const GET_CAMPAIGN = gql`
  query GetCampaign($id: ID!) {
    campaign(id: $id) {
      id
      name
      type
      templateId
      segment {
        id
        name
        criteria {
          field
          operator
          value
        }
      }
      startDate
      endDate
      status
      metrics {
        sent
        delivered
        opened
        clicked
        converted
        unsubscribed
        bounced
        revenue
      }
    }
  }
`;

export const CREATE_EMAIL_TEMPLATE = gql`
  mutation CreateEmailTemplate($input: CreateTemplateInput!) {
    createEmailTemplate(input: $input) {
      id
      name
      subject
      content
      category
      version
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_CAMPAIGN = gql`
  mutation CreateCampaign($input: CreateCampaignInput!) {
    createCampaign(input: $input) {
      id
      name
      type
      templateId
      segment {
        id
        name
        criteria {
          field
          operator
          value
        }
      }
      startDate
      endDate
      status
    }
  }
`;

export const CREATE_EMAIL_TEST = gql`
  mutation CreateEmailTest($input: CreateTestInput!) {
    createEmailTest(input: $input) {
      id
      templateId
      subject
      content
      metrics {
        sent
        opened
        clicked
        converted
        revenue
      }
    }
  }
`;
