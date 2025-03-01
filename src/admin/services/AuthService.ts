import { AdminUser, Permission } from '../types';
import { GraphQLClient } from 'graphql-request';
import jwt_decode from 'jwt-decode';
import { authenticator } from 'otplib';

export interface LoginResponse {
  token: string;
  user: AdminUser;
  requires2FA: boolean;
}

export interface TokenPayload {
  sub: string;
  email: string;
  permissions: Permission[];
  exp: number;
}

class AuthService {
  private static instance: AuthService;
  private token: string | null = null;
  private refreshTimeout: NodeJS.Timeout | null = null;
  private client: GraphQLClient;

  private constructor() {
    this.client = new GraphQLClient('/api/admin/graphql', {
      credentials: 'include',
    });
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async login(email: string, password: string): Promise<LoginResponse> {
    const mutation = `
      mutation AdminLogin($email: String!, $password: String!) {
        adminLogin(email: $email, password: $password) {
          token
          user {
            id
            email
            firstName
            lastName
            role
            permissions
            lastLogin
          }
          requires2FA
        }
      }
    `;

    try {
      const response = await this.client.request(mutation, { email, password });
      if (response.adminLogin.token) {
        this.setToken(response.adminLogin.token);
      }
      return response.adminLogin;
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  }

  public async logout(): Promise<void> {
    const mutation = `
      mutation AdminLogout {
        adminLogout
      }
    `;

    try {
      await this.client.request(mutation);
      this.clearToken();
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  }

  public async refreshToken(): Promise<string> {
    const mutation = `
      mutation RefreshToken {
        refreshAdminToken {
          token
        }
      }
    `;

    try {
      const response = await this.client.request(mutation);
      const newToken = response.refreshAdminToken.token;
      this.setToken(newToken);
      return newToken;
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  }

  public async resetPassword(email: string): Promise<void> {
    const mutation = `
      mutation ResetAdminPassword($email: String!) {
        resetAdminPassword(email: $email)
      }
    `;

    try {
      await this.client.request(mutation, { email });
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  }

  public async updatePassword(token: string, newPassword: string): Promise<void> {
    const mutation = `
      mutation UpdateAdminPassword($token: String!, $newPassword: String!) {
        updateAdminPassword(token: $token, newPassword: $newPassword)
      }
    `;

    try {
      await this.client.request(mutation, { token, newPassword });
    } catch (error) {
      this.handleAuthError(error);
      throw error;
    }
  }

  public async setup2FA(): Promise<string> {
    const mutation = `
      mutation Setup2FA {
        setup2FA {
          qrCode
          secret
        }
      }
    `;

    try {
      const response = await this.client.request(mutation);
      return response.setup2FA.qrCode;
    } catch (error) {
      console.error('Failed to setup 2FA:', error);
      throw error;
    }
  }

  public async verify2FA(code: string): Promise<boolean> {
    const mutation = `
      mutation Verify2FA($code: String!) {
        verify2FA(code: $code)
      }
    `;

    try {
      const response = await this.client.request(mutation, { code });
      return response.verify2FA;
    } catch (error) {
      console.error('Failed to verify 2FA:', error);
      throw error;
    }
  }

  public async verifyBackupCode(code: string): Promise<boolean> {
    const mutation = `
      mutation VerifyBackupCode($code: String!) {
        verifyBackupCode(code: $code)
      }
    `;

    try {
      const response = await this.client.request(mutation, { code });
      return response.verifyBackupCode;
    } catch (error) {
      console.error('Failed to verify backup code:', error);
      throw error;
    }
  }

  public async sendRecoveryEmail(email: string): Promise<void> {
    const mutation = `
      mutation SendRecoveryEmail($email: String!) {
        sendRecoveryEmail(email: $email)
      }
    `;

    try {
      await this.client.request(mutation, { email });
    } catch (error) {
      console.error('Failed to send recovery email:', error);
      throw error;
    }
  }

  public async verifyRecoveryCode(code: string): Promise<boolean> {
    const mutation = `
      mutation VerifyRecoveryCode($code: String!) {
        verifyRecoveryCode(code: $code)
      }
    `;

    try {
      const response = await this.client.request(mutation, { code });
      return response.verifyRecoveryCode;
    } catch (error) {
      console.error('Failed to verify recovery code:', error);
      throw error;
    }
  }

  public async resetPassword(newPassword: string): Promise<void> {
    const mutation = `
      mutation ResetPassword($newPassword: String!) {
        resetPassword(newPassword: $newPassword)
      }
    `;

    try {
      await this.client.request(mutation, { newPassword });
    } catch (error) {
      console.error('Failed to reset password:', error);
      throw error;
    }
  }

  public async revokeSession(sessionId: string): Promise<void> {
    const mutation = `
      mutation RevokeSession($sessionId: ID!) {
        revokeSession(sessionId: $sessionId)
      }
    `;

    try {
      await this.client.request(mutation, { sessionId });
    } catch (error) {
      console.error('Failed to revoke session:', error);
      throw error;
    }
  }

  public async revokeAllSessions(): Promise<void> {
    const mutation = `
      mutation RevokeAllSessions {
        revokeAllSessions
      }
    `;

    try {
      await this.client.request(mutation);
    } catch (error) {
      console.error('Failed to revoke all sessions:', error);
      throw error;
    }
  }

  public async updateDeviceSettings(deviceId: string, settings: { name?: string; trusted?: boolean }): Promise<void> {
    const mutation = `
      mutation UpdateDeviceSettings($deviceId: ID!, $settings: DeviceSettingsInput!) {
        updateDeviceSettings(deviceId: $deviceId, settings: $settings)
      }
    `;

    try {
      await this.client.request(mutation, { deviceId, settings });
    } catch (error) {
      console.error('Failed to update device settings:', error);
      throw error;
    }
  }

  public async removeDevice(deviceId: string): Promise<void> {
    const mutation = `
      mutation RemoveDevice($deviceId: ID!) {
        removeDevice(deviceId: $deviceId)
      }
    `;

    try {
      await this.client.request(mutation, { deviceId });
    } catch (error) {
      console.error('Failed to remove device:', error);
      throw error;
    }
  }

  public getToken(): string | null {
    return this.token;
  }

  public isAuthenticated(): boolean {
    return !!this.token && !this.isTokenExpired();
  }

  public getUser(): AdminUser | null {
    if (!this.token) return null;
    try {
      const decoded = jwt_decode<TokenPayload>(this.token);
      return {
        id: decoded.sub,
        email: decoded.email,
        permissions: decoded.permissions,
      } as AdminUser;
    } catch {
      return null;
    }
  }

  private setToken(token: string): void {
    this.token = token;
    this.setupTokenRefresh();
    this.client.setHeader('Authorization', `Bearer ${token}`);
    localStorage.setItem('adminToken', token);
  }

  private clearToken(): void {
    this.token = null;
    this.client.setHeader('Authorization', '');
    localStorage.removeItem('adminToken');
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
      this.refreshTimeout = null;
    }
  }

  private setupTokenRefresh(): void {
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }

    const decoded = jwt_decode<TokenPayload>(this.token!);
    const expiresIn = decoded.exp * 1000 - Date.now();
    const refreshTime = Math.max(expiresIn - 60000, 0); // Refresh 1 minute before expiry

    this.refreshTimeout = setTimeout(() => {
      this.refreshToken().catch(() => {
        this.clearToken();
        window.location.href = '/admin/login';
      });
    }, refreshTime);
  }

  private isTokenExpired(): boolean {
    if (!this.token) return true;
    try {
      const decoded = jwt_decode<TokenPayload>(this.token);
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  private handleAuthError(error: any): void {
    if (error?.response?.status === 401) {
      this.clearToken();
      window.location.href = '/admin/login';
    }
  }
}

export const authService = AuthService.getInstance();
