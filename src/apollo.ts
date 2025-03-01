import { ApolloClient, InMemoryCache, from, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import {
  couponsVar, loyaltyProgramVar, emailCampaignsVar, customerSegmentsVar
} from './graphql/mocks/marketingMocks';
import {
  createCouponMutation,
  updateCouponMutation,
  deleteCouponMutation,
  updateLoyaltySettingsMutation,
  createRewardMutation,
  updateRewardMutation,
  createTierMutation,
  updateTierMutation,
  createCampaignMutation,
  updateCampaignMutation,
  deleteCampaignMutation,
} from './graphql/mutations/marketingMutations';

// Create an http link
const httpLink = new HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:4000/graphql',
  credentials: 'include',
  headers: {
    'apollo-require-preflight': 'true'
  }
});

// Add auth token to requests
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Add error handling
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    console.error('[GraphQL errors]:', graphQLErrors);
  }
  if (networkError) {
    console.error('[Network error]:', networkError);
    console.error('Full network error:', networkError);
  }
});

// Configure Apollo Client
export const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          dashboardStats: {
            merge(existing, incoming) {
              return incoming;
            },
          },
          // Marketing fields with local resolvers
          coupons: {
            read() {
              return couponsVar();
            }
          },
          loyaltyProgram: {
            read() {
              return loyaltyProgramVar();
            }
          },
          emailCampaigns: {
            read() {
              return emailCampaignsVar();
            }
          },
          customerSegments: {
            read() {
              return customerSegmentsVar();
            }
          },
          // Add SEO metrics field policy
          seoMetrics: {
            merge: true,
          }
        },
      },
      Mutation: {
        fields: {
          // Marketing mutations
          createCoupon: (_, { args }) => {
            const { input } = args;
            return createCouponMutation(input);
          },
          updateCoupon: (_, { args }) => {
            const { id, input } = args;
            return updateCouponMutation(id, input);
          },
          deleteCoupon: (_, { args }) => {
            const { id } = args;
            return deleteCouponMutation(id);
          },
          updateLoyaltySettings: (_, { args }) => {
            const { input } = args;
            return updateLoyaltySettingsMutation(input);
          },
          createReward: (_, { args }) => {
            const { input } = args;
            return createRewardMutation(input);
          },
          updateReward: (_, { args }) => {
            const { id, input } = args;
            return updateRewardMutation(id, input);
          },
          createTier: (_, { args }) => {
            const { input } = args;
            return createTierMutation(input);
          },
          updateTier: (_, { args }) => {
            const { id, input } = args;
            return updateTierMutation(id, input);
          },
          createCampaign: (_, { args }) => {
            const { input } = args;
            return createCampaignMutation(input);
          },
          updateCampaign: (_, { args }) => {
            const { id, input } = args;
            return updateCampaignMutation(id, input);
          },
          deleteCampaign: (_, { args }) => {
            const { id } = args;
            return deleteCampaignMutation(id);
          },
        },
      },
      DashboardStats: {
        fields: {
          revenue: {
            merge(existing, incoming) {
              return incoming || { total: 0, previousPeriod: 0, percentageChange: 0 };
            },
          },
          orders: {
            merge(existing, incoming) {
              return incoming || { total: 0, pending: 0, percentageChange: 0 };
            },
          },
          products: {
            merge(existing, incoming) {
              return incoming || { total: 0, outOfStock: 0 };
            },
          },
          customers: {
            merge(existing, incoming) {
              return incoming || { total: 0, new: 0, returning: 0, percentageChange: 0 };
            },
          },
        },
      },
      InventoryItem: {
        fields: {
          currentStock: {
            read(existing, { readField }) {
              const quantity = readField('quantity');
              return typeof quantity === 'number' ? quantity : 0;
            },
          },
        },
      },
      Campaign: {
        fields: {
          opens: {
            read(existing, { readField }) {
              const metrics = readField('metrics');
              return metrics?.impressions ?? 0;
            },
          },
          clicks: {
            read(existing, { readField }) {
              const metrics = readField('metrics');
              return metrics?.clicks ?? 0;
            },
          },
          conversions: {
            read(existing, { readField }) {
              const metrics = readField('metrics');
              return metrics?.conversions ?? 0;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});
