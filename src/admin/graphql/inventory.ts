import { gql } from '@apollo/client';

export const GET_PRODUCTS_INVENTORY = gql`
  query GetProductsInventory {
    products {
      id
      sku
      name
      stockLevel
      lowStockThreshold
      lastUpdated
      stock_status
      price {
        regularPrice {
          amount {
            value
            currency
          }
        }
      }
    }
  }
`;

export const UPDATE_STOCK_LEVEL = gql`
  mutation UpdateStockLevel($input: UpdateStockLevelInput!) {
    updateStockLevel(input: $input) {
      id
      sku
      stockLevel
      lastUpdated
      stock_status
    }
  }
`;

export const LOG_STOCK_ADJUSTMENT = gql`
  mutation LogStockAdjustment($input: StockAdjustmentInput!) {
    logStockAdjustment(input: $input) {
      id
      productId
      type
      quantity
      reason
      notes
      adjustedBy
      timestamp
    }
  }
`;

export const GET_STOCK_HISTORY = gql`
  query GetStockHistory($productId: ID!, $limit: Int) {
    stockHistory(productId: $productId, limit: $limit) {
      id
      timestamp
      type
      quantity
      reason
      notes
      performedBy {
        id
        name
      }
    }
  }
`;

export const CREATE_PRODUCT_INVENTORY = gql`
  mutation CreateProductInventory($input: ProductInventoryInput!) {
    createProductInventory(input: $input) {
      id
      productId
      stockLevel
      lowStockThreshold
      sku
      lastUpdated
    }
  }
`;

export const UPDATE_PRODUCT_INVENTORY = gql`
  mutation UpdateProductInventory($productId: ID!, $input: ProductInventoryInput!) {
    updateProductInventory(productId: $productId, input: $input) {
      id
      productId
      stockLevel
      lowStockThreshold
      sku
      lastUpdated
    }
  }
`;
