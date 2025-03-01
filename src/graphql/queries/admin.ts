import { gql } from '@apollo/client';

export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats($filters: DashboardFiltersInput!) {
    dashboardStats(filters: $filters) {
      revenue {
        total
        previousPeriod
        percentageChange
        breakdown {
          period
          amount
        }
      }
      orders {
        total
        pending
        processing
        shipped
        delivered
        cancelled
        percentageChange
        recentOrders {
          id
          orderNumber
          status
          total
          createdAt
          customer {
            name
            email
          }
        }
      }
      products {
        total
        outOfStock
        lowStock
        topSellers {
          id
          name
          sku
          price
          quantitySold
          revenue
        }
      }
      customers {
        total
        new
        returning
        percentageChange
        recentCustomers {
          id
          name
          email
          totalOrders
          totalSpent
          lastOrderDate
        }
      }
      inventory {
        totalValue
        totalItems
        lowStockItems {
          id
          name
          sku
          currentStock
          reorderPoint
        }
        outOfStockItems {
          id
          name
          sku
          lastInStock
        }
      }
      marketing {
        activePromotions
        emailSubscribers
        campaignPerformance {
          name
          opens
          clicks
          conversions
        }
      }
      systemHealth {
        status
        uptime
        lastBackup
        pendingUpdates
        errors {
          count
          recent {
            message
            timestamp
            severity
          }
        }
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

export const GET_SYSTEM_SETTINGS = gql`
  query GetSystemSettings {
    systemSettings {
      siteName
      logo
      theme
      currency
      timezone
      emailSettings {
        provider
        fromEmail
        fromName
      }
      paymentGateways {
        name
        enabled
        testMode
      }
      shippingMethods {
        name
        enabled
        rate
      }
      integrations {
        name
        enabled
        apiKey
        status
      }
    }
  }
`;
