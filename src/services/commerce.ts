import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import type {
  Product,
  Category,
  Cart,
  Customer,
  CartItem,
  Address,
  PaymentMethod,
  ShippingMethod,
  Order,
  SearchResult
} from '../types/commerce';
import type {
  ApiResponse,
  ProductResponse,
  ProductsResponse,
  CategoryResponse,
  CartResponse,
  OrderResponse
} from '../types/api';

// Create the Apollo Client instance
const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_API_URL,
  credentials: 'same-origin',
  fetchOptions: {
    mode: 'cors'
  }
});

const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  const token = localStorage.getItem('customerToken');
  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
      'Store': import.meta.env.VITE_ADOBE_COMMERCE_STORE_CODE || 'default',
    }
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    possibleTypes: {
      // Add possible interface/union types here if needed
      ProductInterface: ['SimpleProduct', 'ConfigurableProduct']
    },
    typePolicies: {
      Query: {
        fields: {
          products: {
            merge(existing, incoming) {
              return incoming;
            },
          },
          cart: {
            merge(existing, incoming) {
              return incoming;
            },
          },
          featuredProducts: {
            merge(existing, incoming) {
              return incoming;
            },
          },
        },
      },
      Product: {
        keyFields: ['id', 'sku'],
        fields: {
          price: {
            merge: true,
          },
          scent_profile: {
            merge: true,
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
      errorPolicy: 'all'
    },
    query: {
      fetchPolicy: 'cache-first',
      errorPolicy: 'all'
    },
    mutate: {
      errorPolicy: 'all'
    }
  },
});

interface GetProductsArgs {
  categoryId?: string;
  pageSize?: number;
  currentPage?: number;
  filters?: Record<string, any>;
}

export const getProducts = async ({
  categoryId,
  pageSize = 12,
  currentPage = 1,
  filters = {}
}: GetProductsArgs): Promise<ProductsResponse> => {
  const GET_PRODUCTS = gql`
    query GetProducts($categoryId: ID, $pageSize: Int!, $currentPage: Int!, $filters: ProductFilterInput) {
      products(
        categoryId: $categoryId
        pageSize: $pageSize
        currentPage: $currentPage
        filter: $filters
      ) {
        items {
          id
          name
          price
          image
          scent
          size
        }
        total_count
        page_info {
          current_page
          total_pages
          has_next_page
          has_previous_page
        }
      }
    }
  `;

  try {
    const response = await client.query({
      query: GET_PRODUCTS,
      variables: { categoryId, pageSize, currentPage, filters }
    });
    return {
      data: response.data.products,
      status: 200
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      data: { items: [], total_count: 0, page_info: { current_page: 1, total_pages: 0, has_next_page: false, has_previous_page: false } },
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      status: 500
    };
  }
};

export const getProduct = async (urlKey: string): Promise<ProductResponse> => {
  const GET_PRODUCT = gql`
    query GetProduct($urlKey: String!) {
      product(urlKey: $urlKey) {
        id
        name
        description
        price
        stock
        scent
        size
        imageUrl
        isFeatured
        status
        categories {
          id
          name
        }
        averageRating
        reviewCount
        createdAt
        updatedAt
      }
    }
  `;

  try {
    const response = await client.query({
      query: GET_PRODUCT,
      variables: { urlKey }
    });
    return {
      data: response.data.product,
      status: 200
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      status: 500
    };
  }
};

// Category queries
export const getCategories = async (): Promise<CategoryResponse> => {
  const GET_CATEGORIES = gql`
    query GetCategories {
      categories {
        id
        name
        urlPath
        children {
          id
          name
          urlPath
        }
      }
    }
  `;

  try {
    const response = await client.query({
      query: GET_CATEGORIES
    });
    return {
      data: response.data.categories,
      status: 200
    };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return {
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      status: 500
    };
  }
};

export const getCategory = async (urlPath: string): Promise<CategoryResponse> => {
  const GET_CATEGORY = gql`
    query GetCategory($urlPath: String!) {
      category(urlPath: $urlPath) {
        id
        name
        urlPath
        children {
          id
          name
          urlPath
        }
      }
    }
  `;

  try {
    const response = await client.query({
      query: GET_CATEGORY,
      variables: { urlPath }
    });
    return {
      data: response.data.category,
      status: 200
    };
  } catch (error) {
    console.error('Error fetching category:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      status: 500
    };
  }
};

// Cart operations
export const createCart = async (): Promise<CartResponse> => {
  const CREATE_CART = gql`
    mutation CreateCart {
      createCart {
        id
      }
    }
  `;

  try {
    const response = await client.mutate({
      mutation: CREATE_CART
    });
    return {
      data: response.data.createCart,
      status: 200
    };
  } catch (error) {
    console.error('Error creating cart:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      status: 500
    };
  }
};

export const getCart = async (cartId: string): Promise<CartResponse> => {
  const GET_CART = gql`
    query GetCart($cartId: ID!) {
      cart(id: $cartId) {
        id
        items {
          id
          product {
            id
            name
            price
            image
          }
          quantity
        }
        total
      }
    }
  `;

  try {
    const response = await client.query({
      query: GET_CART,
      variables: { cartId }
    });
    return {
      data: response.data.cart,
      status: 200
    };
  } catch (error) {
    console.error('Error fetching cart:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      status: 500
    };
  }
};

export const addToCart = async (
  cartId: string,
  sku: string,
  quantity: number
): Promise<CartResponse> => {
  const ADD_TO_CART = gql`
    mutation AddToCart($cartId: ID!, $sku: String!, $quantity: Int!) {
      addCartItems(cartId: $cartId, cartItems: [{ sku: $sku, quantity: $quantity }]) {
        id
        items {
          id
          product {
            id
            name
            price
            image
          }
          quantity
        }
        total
      }
    }
  `;

  try {
    const response = await client.mutate({
      mutation: ADD_TO_CART,
      variables: { cartId, sku, quantity }
    });
    return {
      data: response.data.addCartItems,
      status: 200
    };
  } catch (error) {
    console.error('Error adding to cart:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      status: 500
    };
  }
};

export const updateCartItem = async (
  cartId: string,
  itemId: string,
  quantity: number
): Promise<CartResponse> => {
  const UPDATE_CART_ITEM = gql`
    mutation UpdateCartItem($cartId: ID!, $itemId: ID!, $quantity: Int!) {
      updateCartItem(cartId: $cartId, itemId: $itemId, quantity: $quantity) {
        id
        items {
          id
          product {
            id
            name
            price
            image
          }
          quantity
        }
        total
      }
    }
  `;

  try {
    const response = await client.mutate({
      mutation: UPDATE_CART_ITEM,
      variables: { cartId, itemId, quantity }
    });
    return {
      data: response.data.updateCartItem,
      status: 200
    };
  } catch (error) {
    console.error('Error updating cart item:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      status: 500
    };
  }
};

export const removeFromCart = async (
  cartId: string,
  itemId: string
): Promise<CartResponse> => {
  const REMOVE_FROM_CART = gql`
    mutation RemoveFromCart($cartId: ID!, $itemId: ID!) {
      removeCartItem(cartId: $cartId, itemId: $itemId) {
        id
        items {
          id
          product {
            id
            name
            price
            image
          }
          quantity
        }
        total
      }
    }
  `;

  try {
    const response = await client.mutate({
      mutation: REMOVE_FROM_CART,
      variables: { cartId, itemId }
    });
    return {
      data: response.data.removeCartItem,
      status: 200
    };
  } catch (error) {
    console.error('Error removing from cart:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      status: 500
    };
  }
};

// Customer operations
export const createCustomer = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<ApiResponse<Customer>> => {
  const CREATE_CUSTOMER = gql`
    mutation CreateCustomer($email: String!, $password: String!, $firstName: String!, $lastName: String!) {
      createCustomer(email: $email, password: $password, firstName: $firstName, lastName: $lastName) {
        id
      }
    }
  `;

  try {
    const response = await client.mutate({
      mutation: CREATE_CUSTOMER,
      variables: { email, password, firstName, lastName }
    });
    return {
      data: response.data.createCustomer,
      status: 200
    };
  } catch (error) {
    console.error('Error creating customer:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      status: 500
    };
  }
};

export const loginCustomer = async (
  email: string,
  password: string
): Promise<ApiResponse<Customer>> => {
  const LOGIN_CUSTOMER = gql`
    mutation LoginCustomer($email: String!, $password: String!) {
      loginCustomer(email: $email, password: $password) {
        token
      }
    }
  `;

  try {
    const response = await client.mutate({
      mutation: LOGIN_CUSTOMER,
      variables: { email, password }
    });
    return {
      data: response.data.loginCustomer,
      status: 200
    };
  } catch (error) {
    console.error('Error logging in customer:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      status: 500
    };
  }
};

export const getCustomer = async (): Promise<ApiResponse<Customer>> => {
  const GET_CUSTOMER = gql`
    query GetCustomer {
      customer {
        id
        email
        firstName
        lastName
      }
    }
  `;

  try {
    const response = await client.query({
      query: GET_CUSTOMER
    });
    return {
      data: response.data.customer,
      status: 200
    };
  } catch (error) {
    console.error('Error fetching customer:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      status: 500
    };
  }
};

// Order operations
export const placeOrder = async (
  cartId: string,
  billingAddress: Address,
  shippingAddress: Address,
  paymentMethod: PaymentMethod,
  shippingMethod: ShippingMethod
): Promise<ApiResponse<Order>> => {
  const PLACE_ORDER = gql`
    mutation PlaceOrder($cartId: ID!, $billingAddress: AddressInput!, $shippingAddress: AddressInput!, $paymentMethod: String!, $shippingMethod: String!) {
      placeOrder(cartId: $cartId, billingAddress: $billingAddress, shippingAddress: $shippingAddress, paymentMethod: $paymentMethod, shippingMethod: $shippingMethod) {
        id
      }
    }
  `;

  try {
    const response = await client.mutate({
      mutation: PLACE_ORDER,
      variables: { cartId, billingAddress, shippingAddress, paymentMethod, shippingMethod }
    });
    return {
      data: response.data.placeOrder,
      status: 200
    };
  } catch (error) {
    console.error('Error placing order:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      status: 500
    };
  }
};

// Search operations
export const searchProducts = async (
  searchTerm: string,
  pageSize = 12,
  currentPage = 1
): Promise<ProductsResponse> => {
  const SEARCH_PRODUCTS = gql`
    query SearchProducts($searchTerm: String!, $pageSize: Int!, $currentPage: Int!) {
      searchProducts(searchTerm: $searchTerm, pageSize: $pageSize, currentPage: $currentPage) {
        items {
          id
          name
          price
          image
          scent
          size
        }
        total_count
        page_info {
          current_page
          total_pages
          has_next_page
          has_previous_page
        }
      }
    }
  `;

  try {
    const response = await client.query({
      query: SEARCH_PRODUCTS,
      variables: { searchTerm, pageSize, currentPage }
    });
    return {
      data: response.data.searchProducts,
      status: 200
    };
  } catch (error) {
    console.error('Error searching products:', error);
    return {
      data: { items: [], total_count: 0, page_info: { current_page: 1, total_pages: 0, has_next_page: false, has_previous_page: false } },
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      status: 500
    };
  }
};
