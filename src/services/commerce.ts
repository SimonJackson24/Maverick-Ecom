import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import type { Product, Category, Cart, Customer } from '../types/commerce';

// Create the Apollo Client instance
const httpLink = createHttpLink({
  uri: process.env.VITE_ADOBE_COMMERCE_ENDPOINT,
});

const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  const token = localStorage.getItem('customerToken');
  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
      'Store': 'default', // Add your store code if needed
    }
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// Product queries and mutations
export const getProducts = async (
  categoryId?: string,
  pageSize = 12,
  currentPage = 1,
  filters?: Record<string, any>
): Promise<{ items: Product[], total_count: number }> => {
  // Implementation will use Apollo Client to fetch products
  // This is a placeholder that will be implemented with actual GraphQL queries
  return { items: [], total_count: 0 };
};

export const getProduct = async (urlKey: string): Promise<Product | null> => {
  // Implementation will use Apollo Client to fetch a single product
  return null;
};

// Category queries
export const getCategories = async (): Promise<Category[]> => {
  // Implementation will use Apollo Client to fetch categories
  return [];
};

export const getCategory = async (urlPath: string): Promise<Category | null> => {
  // Implementation will use Apollo Client to fetch a single category
  return null;
};

// Cart operations
export const createCart = async (): Promise<string> => {
  // Implementation will use Apollo Client to create a new cart
  return '';
};

export const getCart = async (cartId: string): Promise<Cart | null> => {
  // Implementation will use Apollo Client to fetch cart details
  return null;
};

export const addToCart = async (
  cartId: string,
  sku: string,
  quantity: number
): Promise<Cart> => {
  // Implementation will use Apollo Client to add items to cart
  throw new Error('Not implemented');
};

export const updateCartItem = async (
  cartId: string,
  itemId: string,
  quantity: number
): Promise<Cart> => {
  // Implementation will use Apollo Client to update cart items
  throw new Error('Not implemented');
};

export const removeFromCart = async (
  cartId: string,
  itemId: string
): Promise<Cart> => {
  // Implementation will use Apollo Client to remove items from cart
  throw new Error('Not implemented');
};

// Customer operations
export const createCustomer = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<Customer> => {
  // Implementation will use Apollo Client to create a new customer
  throw new Error('Not implemented');
};

export const loginCustomer = async (
  email: string,
  password: string
): Promise<string> => {
  // Implementation will use Apollo Client to login customer and return token
  throw new Error('Not implemented');
};

export const getCustomer = async (): Promise<Customer | null> => {
  // Implementation will use Apollo Client to fetch customer details
  return null;
};

// Order operations
export const placeOrder = async (
  cartId: string,
  billingAddress: any,
  shippingAddress: any,
  paymentMethod: string,
  shippingMethod: string
): Promise<string> => {
  // Implementation will use Apollo Client to place an order
  throw new Error('Not implemented');
};

// Search operations
export const searchProducts = async (
  searchTerm: string,
  pageSize = 12,
  currentPage = 1
): Promise<{ items: Product[], total_count: number }> => {
  // Implementation will use Apollo Client to search products
  return { items: [], total_count: 0 };
};
