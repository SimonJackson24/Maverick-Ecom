import { gql } from '@apollo/client';
import { apolloClient } from '../../lib/apollo';
import { 
  SalesAnalytics, 
  ScentAnalytics, 
  CustomerAnalytics,
  InventoryAnalytics,
  DateRangeInput,
  AnalyticsFilter
} from '../types/analytics';

export class AnalyticsService {
  static async getSalesAnalytics(dateRange: DateRangeInput, filters?: AnalyticsFilter): Promise<SalesAnalytics> {
    const { data } = await apolloClient.query({
      query: gql`
        query GetSalesAnalytics($dateRange: DateRangeInput!, $filters: AnalyticsFilter) {
          salesAnalytics(dateRange: $dateRange, filters: $filters) {
            revenue {
              total
              byDay {
                date
                amount
              }
              byCategory {
                category
                amount
              }
              byProduct {
                product {
                  id
                  name
                  sku
                  price {
                    regularPrice {
                      amount {
                        value
                        currency
                      }
                    }
                  }
                }
                amount
              }
            }
            orders {
              total
              byDay {
                date
                count
              }
              byStatus {
                status
                count
              }
              averageValue
            }
            conversions {
              rate
              bySource {
                source
                rate
              }
            }
          }
        }
      `,
      variables: { dateRange, filters },
    });
    return data.salesAnalytics;
  }

  static async getScentAnalytics(dateRange: DateRangeInput, filters?: AnalyticsFilter): Promise<ScentAnalytics> {
    const { data } = await apolloClient.query({
      query: gql`
        query GetScentAnalytics($dateRange: DateRangeInput!, $filters: AnalyticsFilter) {
          scentAnalytics(dateRange: $dateRange, filters: $filters) {
            popularScents {
              scent
              count
            }
            scentCombinations {
              combination
              count
            }
            seasonalTrends {
              season
              topScents {
                scent
                count
              }
            }
          }
        }
      `,
      variables: { dateRange, filters },
    });
    return data.scentAnalytics;
  }

  static async getCustomerAnalytics(dateRange: DateRangeInput, filters?: AnalyticsFilter): Promise<CustomerAnalytics> {
    const { data } = await apolloClient.query({
      query: gql`
        query GetCustomerAnalytics($dateRange: DateRangeInput!, $filters: AnalyticsFilter) {
          customerAnalytics(dateRange: $dateRange, filters: $filters) {
            total
            new
            returning
            segments {
              name
              count
              value
            }
            retention {
              rate
              bySegment {
                segment
                rate
              }
            }
            lifetime {
              value
              bySegment {
                segment
                value
              }
            }
          }
        }
      `,
      variables: { dateRange, filters },
    });
    return data.customerAnalytics;
  }

  static async getInventoryAnalytics(dateRange: DateRangeInput, filters?: AnalyticsFilter): Promise<InventoryAnalytics> {
    const { data } = await apolloClient.query({
      query: gql`
        query GetInventoryAnalytics($dateRange: DateRangeInput!, $filters: AnalyticsFilter) {
          inventoryAnalytics(dateRange: $dateRange, filters: $filters) {
            stock {
              total
              low {
                id
                name
                sku
                price {
                  regularPrice {
                    amount {
                      value
                      currency
                    }
                  }
                }
                stockLevel
              }
              outOfStock {
                id
                name
                sku
                price {
                  regularPrice {
                    amount {
                      value
                      currency
                    }
                  }
                }
                stockLevel
              }
            }
            turnover {
              rate
              byProduct {
                product {
                  id
                  name
                  sku
                }
                rate
              }
            }
            forecast {
              demand {
                product {
                  id
                  name
                  sku
                }
                quantity
              }
              restockDates {
                product {
                  id
                  name
                  sku
                }
                date
              }
            }
          }
        }
      `,
      variables: { dateRange, filters },
    });
    return data.inventoryAnalytics;
  }

  static async exportAnalyticsReport(
    type: string,
    dateRange: DateRangeInput,
    format: 'CSV' | 'PDF' | 'EXCEL'
  ) {
    const { data } = await apolloClient.mutate({
      mutation: gql`
        mutation ExportAnalyticsReport($type: String!, $dateRange: DateRangeInput!, $format: ExportFormat!) {
          exportAnalyticsReport(type: $type, dateRange: $dateRange, format: $format) {
            url
            expiresAt
          }
        }
      `,
      variables: { type, dateRange, format }
    });

    return data.exportAnalyticsReport;
  }

  static async getRealtimeMetrics() {
    const { data } = await apolloClient.query({
      query: gql`
        query GetRealtimeMetrics {
          realtimeMetrics {
            activeUsers
            currentRevenue
            cartAbandonment
            popularProducts {
              id
              name
              viewCount
            }
          }
        }
      `
    });

    return data.realtimeMetrics;
  }
}
