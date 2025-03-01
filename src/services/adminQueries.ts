import { gql } from '@apollo/client';

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
      }
      requiresTwoFactor
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

export const VERIFY_ADMIN_2FA = gql`
  mutation VerifyAdmin2FA($code: String!) {
    verifyAdmin2FA(code: $code) {
      success
      token
      user {
        id
        name
        email
        role
        permissions
      }
    }
  }
`;

export const UPDATE_ADMIN_PROFILE = gql`
  mutation UpdateAdminProfile($input: UpdateAdminProfileInput!) {
    updateAdminProfile(input: $input) {
      id
      name
      email
      role
      permissions
      twoFactorEnabled
    }
  }
`;

export const ENABLE_2FA = gql`
  mutation Enable2FA {
    enable2FA {
      success
      qrCode
      backupCodes
    }
  }
`;

export const DISABLE_2FA = gql`
  mutation Disable2FA($code: String!) {
    disable2FA(code: $code) {
      success
    }
  }
`;

export const RESET_ADMIN_PASSWORD = gql`
  mutation ResetAdminPassword($email: String!) {
    resetAdminPassword(email: $email) {
      success
    }
  }
`;

export const CONFIRM_ADMIN_PASSWORD_RESET = gql`
  mutation ConfirmAdminPasswordReset($token: String!, $password: String!) {
    confirmAdminPasswordReset(token: $token, password: $password) {
      success
    }
  }
`;
