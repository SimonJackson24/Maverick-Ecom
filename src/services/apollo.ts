import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { monitoring } from './monitoring/MonitoringService';

const isDev = import.meta.env.MODE === 'development';

const httpLink = createHttpLink({
  uri: isDev ? '/graphql' : import.meta.env.VITE_GRAPHQL_API_URL,
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  // Only log errors in production
  if (!isDev) {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => {
        monitoring.logError('graphql_error', {
          message,
          componentName: 'Apollo',
          additionalContext: { locations, path, operationName: operation.operationName }
        });
      });
    }
    if (networkError) {
      monitoring.logError('network_error', {
        message: networkError.message,
        componentName: 'Apollo',
        additionalContext: { 
          name: networkError.name,
          operationName: operation.operationName
        }
      });
    }
  }
});

export const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Product: {
        keyFields: ['id'],
      },
      SystemSettings: {
        keyFields: [],
        merge: true,
      }
    }
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: isDev ? 'cache-first' : 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: isDev ? 'cache-first' : 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});
