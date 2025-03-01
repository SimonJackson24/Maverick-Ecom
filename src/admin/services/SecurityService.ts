import { gql } from '@apollo/client';
import { apolloClient } from '../../lib/apollo';

interface Device {
  id: string;
  deviceName: string;
  lastActive: string;
  browser: string;
  os: string;
  location: string;
  isCurrent: boolean;
}

interface SecurityEvent {
  id: string;
  timestamp: string;
  eventType: string;
  status: string;
  ipAddress: string;
  location: string;
  deviceInfo: string;
}

interface SecurityEventFilters {
  startDate: string;
  endDate: string;
  eventType?: string;
}

const GET_DEVICES = gql`
  query GetDevices {
    adminDevices {
      id
      deviceName
      lastActive
      browser
      os
      location
      isCurrent
    }
  }
`;

const REVOKE_DEVICE = gql`
  mutation RevokeDevice($deviceId: ID!) {
    revokeDevice(deviceId: $deviceId) {
      success
      message
    }
  }
`;

const GET_SECURITY_EVENTS = gql`
  query GetSecurityEvents($filters: SecurityEventFiltersInput!) {
    securityEvents(filters: $filters) {
      id
      timestamp
      eventType
      status
      ipAddress
      location
      deviceInfo
    }
  }
`;

export const SecurityService = {
  async getDevices(): Promise<Device[]> {
    const { data } = await apolloClient.query({
      query: GET_DEVICES,
      fetchPolicy: 'network-only'
    });
    return data.adminDevices;
  },

  async revokeDevice(deviceId: string): Promise<{ success: boolean; message: string }> {
    const { data } = await apolloClient.mutate({
      mutation: REVOKE_DEVICE,
      variables: { deviceId }
    });
    return data.revokeDevice;
  },

  async getSecurityEvents(filters: SecurityEventFilters): Promise<SecurityEvent[]> {
    const { data } = await apolloClient.query({
      query: GET_SECURITY_EVENTS,
      variables: { filters },
      fetchPolicy: 'network-only'
    });
    return data.securityEvents;
  }
};
