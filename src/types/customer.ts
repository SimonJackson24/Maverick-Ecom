import { Order } from './order';

export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  orders?: Order[];
  createdAt: string;
  updatedAt: string;
}

export interface CustomerAddress {
  id: string;
  customerId: string;
  firstName: string;
  lastName: string;
  company?: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
  type: 'billing' | 'shipping';
}
