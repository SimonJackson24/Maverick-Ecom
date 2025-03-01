import { Order } from './order';
import { Product } from './product';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export type UserRole = 'user' | 'admin';

export interface UserProfile extends User {
  addresses: Address[];
  wishlists: Wishlist[];
  orders: Order[];
  reviews: Review[];
  preferences: UserPreferences;
}

export interface Address {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  streetAddress: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Wishlist {
  id: string;
  userId: string;
  name: string;
  isPublic: boolean;
  items: WishlistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface WishlistItem {
  wishlistId: string;
  product: Product;
  addedAt: string;
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  orderId: string;
  rating: number;
  title?: string;
  content?: string;
  isVerifiedPurchase: boolean;
  status: ReviewStatus;
  createdAt: string;
  updatedAt: string;
}

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface UserPreferences {
  scentPreferences: string[];
  marketingEmails: boolean;
  orderNotifications: boolean;
  wishlistNotifications: boolean;
  theme: 'light' | 'dark' | 'system';
  currency: string;
  language: string;
}

export interface UserStats {
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate?: string;
  wishlistCount: number;
  reviewCount: number;
  averageRating: number;
}

export interface UserFilter {
  role?: UserRole[];
  startDate?: string;
  endDate?: string;
  minOrders?: number;
  minSpent?: number;
  sortBy?: 'name' | 'orders' | 'spent' | 'joined';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface UserSearchResult {
  items: User[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegistrationData {
  email: string;
  password: string;
  name: string;
}

export interface PasswordReset {
  email: string;
  token: string;
  newPassword: string;
}

export interface UserSession {
  user: User;
  token: string;
  expiresAt: string;
}
