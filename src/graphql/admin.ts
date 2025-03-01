import { gql } from '@apollo/client';

export const GET_ADMIN_USERS = gql`
  query GetAdminUsers {
    adminUsers {
      id
      name
      email
      role
      permissions
      lastLogin
      twoFactorEnabled
    }
  }
`;

export const CREATE_ADMIN_USER = gql`
  mutation CreateAdminUser($input: AdminUserInput!) {
    createAdminUser(input: $input) {
      id
      name
      email
      role
      permissions
      lastLogin
      twoFactorEnabled
    }
  }
`;

export const UPDATE_ADMIN_USER = gql`
  mutation UpdateAdminUser($id: ID!, $input: AdminUserInput!) {
    updateAdminUser(id: $id, input: $input) {
      id
      name
      email
      role
      permissions
      lastLogin
      twoFactorEnabled
    }
  }
`;

export const DELETE_ADMIN_USER = gql`
  mutation DeleteAdminUser($id: ID!) {
    deleteAdminUser(id: $id) {
      id
    }
  }
`;

export const ADMIN_LOGIN = gql`
  mutation AdminLogin($email: String!, $password: String!) {
    adminLogin(email: $email, password: $password) {
      token
      user {
        id
        name
        email
        role
        permissions
        lastLogin
        twoFactorEnabled
      }
    }
  }
`;

export const VERIFY_ADMIN_2FA = gql`
  mutation VerifyAdmin2FA($code: String!) {
    verifyAdmin2FA(code: $code) {
      token
      user {
        id
        name
        email
        role
        permissions
        lastLogin
        twoFactorEnabled
      }
    }
  }
`;

export const GET_ADMIN_USER = gql`
  query GetAdminUser {
    adminUser {
      id
      name
      email
      role
      permissions
      lastLogin
      twoFactorEnabled
    }
  }
`;

export const ADMIN_LOGOUT = gql`
  mutation AdminLogout {
    adminLogout {
      success
    }
  }
`;

export const UPDATE_ADMIN_PROFILE = gql`
  mutation UpdateAdminProfile($input: AdminProfileInput!) {
    updateAdminProfile(input: $input) {
      id
      name
      email
      role
      permissions
      lastLogin
      twoFactorEnabled
    }
  }
`;

export const CHANGE_ADMIN_PASSWORD = gql`
  mutation ChangeAdminPassword($currentPassword: String!, $newPassword: String!) {
    changeAdminPassword(currentPassword: $currentPassword, newPassword: $newPassword) {
      success
    }
  }
`;

export const SETUP_ADMIN_2FA = gql`
  mutation SetupAdmin2FA {
    setupAdmin2FA {
      qrCode
      secret
    }
  }
`;

export const DISABLE_ADMIN_2FA = gql`
  mutation DisableAdmin2FA($code: String!) {
    disableAdmin2FA(code: $code) {
      success
    }
  }
`;
