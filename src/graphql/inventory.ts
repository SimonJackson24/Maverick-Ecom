import { gql } from '@apollo/client';

export const INVENTORY_ALERT_FRAGMENT = gql`
  fragment InventoryAlertFields on InventoryAlert {
    id
    productId
    productName
    currentStock
    threshold
    status
    createdAt
    acknowledgedAt
    resolvedAt
  }
`;

export const INVENTORY_SETTINGS_FRAGMENT = gql`
  fragment InventorySettingsFields on InventorySettings {
    lowStockThreshold
    outOfStockThreshold
    enableAutoReorder
    autoReorderThreshold
    notifyAdminsOnLowStock
    notifySupplierOnLowStock
  }
`;

export const GET_INVENTORY_ALERTS = gql`
  query GetInventoryAlerts($status: [StockLevel!]) {
    inventoryAlerts(status: $status) {
      ...InventoryAlertFields
    }
  }
  ${INVENTORY_ALERT_FRAGMENT}
`;

export const GET_INVENTORY_SETTINGS = gql`
  query GetInventorySettings {
    inventorySettings {
      ...InventorySettingsFields
    }
  }
  ${INVENTORY_SETTINGS_FRAGMENT}
`;

export const UPDATE_INVENTORY_SETTINGS = gql`
  mutation UpdateInventorySettings($input: UpdateInventorySettingsInput!) {
    updateInventorySettings(input: $input) {
      ...InventorySettingsFields
    }
  }
  ${INVENTORY_SETTINGS_FRAGMENT}
`;

export const ACKNOWLEDGE_INVENTORY_ALERT = gql`
  mutation AcknowledgeInventoryAlert($id: ID!) {
    acknowledgeInventoryAlert(id: $id) {
      ...InventoryAlertFields
    }
  }
  ${INVENTORY_ALERT_FRAGMENT}
`;

export const RESOLVE_INVENTORY_ALERT = gql`
  mutation ResolveInventoryAlert($id: ID!) {
    resolveInventoryAlert(id: $id) {
      ...InventoryAlertFields
    }
  }
  ${INVENTORY_ALERT_FRAGMENT}
`;

export const UPDATE_INVENTORY = gql`
  mutation UpdateInventory($input: InventoryUpdateInput!) {
    updateInventory(input: $input) {
      id
      productId
      quantity
      previousStock
      newStock
      reason
      notes
      createdAt
      createdBy
    }
  }
`;

export const INVENTORY_ALERT_SUBSCRIPTION = gql`
  subscription OnInventoryAlert {
    inventoryAlert {
      ...InventoryAlertFields
    }
  }
  ${INVENTORY_ALERT_FRAGMENT}
`;

export const GET_INVENTORY_STATS = gql`
  query GetInventoryStats {
    inventoryStats {
      lowStockCount
      outOfStockCount
      totalProducts
      totalStock
      recentTransactions {
        id
        productId
        productName
        quantity
        type
        createdAt
      }
      topLowStock {
        id
        name
        currentStock
        threshold
      }
    }
  }
`;
