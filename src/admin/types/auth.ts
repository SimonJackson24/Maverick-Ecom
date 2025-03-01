export enum Role {
  ADMIN = 'ADMIN',
  SUPPORT = 'SUPPORT',
  CONTENT_MANAGER = 'CONTENT_MANAGER',
  USER = 'USER',
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  role: Role;
}

export interface RoleWithPermissions {
  role: Role;
  permissions: Permission[];
}
