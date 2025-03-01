import { gql } from '@apollo/client';

export const ADD_KEYWORD = gql`
  mutation AddKeyword($input: KeywordInput!) {
    addKeyword(input: $input) {
      id
      keyword
      position
      trend
      volume
      difficulty
      relevance
      lastChecked
    }
  }
`;

export const UPDATE_KEYWORD = gql`
  mutation UpdateKeyword($id: ID!, $input: KeywordInput!) {
    updateKeyword(id: $id, input: $input) {
      id
      keyword
      position
      trend
      volume
      difficulty
      relevance
      lastChecked
    }
  }
`;

export const DELETE_KEYWORD = gql`
  mutation DeleteKeyword($id: ID!) {
    deleteKeyword(id: $id)
  }
`;

export const BULK_UPDATE_KEYWORDS = gql`
  mutation BulkUpdateKeywords($keywords: [KeywordInput!]!) {
    bulkUpdateKeywords(keywords: $keywords) {
      id
      keyword
      position
      trend
      volume
      difficulty
      relevance
      lastChecked
    }
  }
`;
