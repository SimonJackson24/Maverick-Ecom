import { Product, Category, Order, Customer, Cart } from './commerce';

export interface ApiResponse<T> {
  data: T;
  error?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total_count: number;
  page_info: {
    current_page: number;
    total_pages: number;
    has_next_page: boolean;
    has_previous_page: boolean;
  };
}

export interface ProductResponse extends ApiResponse<Product> {}
export interface ProductsResponse extends ApiResponse<PaginatedResponse<Product>> {}
export interface CategoryResponse extends ApiResponse<Category> {}
export interface CategoriesResponse extends ApiResponse<Category[]> {}
export interface OrderResponse extends ApiResponse<Order> {}
export interface OrdersResponse extends ApiResponse<PaginatedResponse<Order>> {}
export interface CustomerResponse extends ApiResponse<Customer> {}
export interface CartResponse extends ApiResponse<Cart> {}

export interface ErrorResponse {
  error: string;
  status: number;
  details?: Record<string, any>;
}
