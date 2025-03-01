import { useQuery, useMutation } from '@apollo/client';
import {
  GET_INVENTORY_ALERTS,
  GET_INVENTORY_SETTINGS,
  UPDATE_INVENTORY_SETTINGS,
  ACKNOWLEDGE_INVENTORY_ALERT,
  RESOLVE_INVENTORY_ALERT,
  UPDATE_INVENTORY,
  GET_INVENTORY_STATS,
} from '../../graphql/inventory';
import {
  InventoryAlertResponse,
  InventorySettingsResponse,
  UpdateInventorySettingsInput,
  InventoryUpdateInput,
  InventoryTransactionResponse,
  AcknowledgeAlertResponse,
  ResolveAlertResponse,
  InventoryStatsResponse,
} from '../../graphql/types/inventory';

export const useInventoryAlerts = (status?: string[]) => {
  const { data, loading, error } = useQuery<InventoryAlertResponse>(
    GET_INVENTORY_ALERTS,
    {
      variables: { status },
    }
  );

  return {
    alerts: data?.inventoryAlerts || [],
    loading,
    error,
  };
};

export const useInventorySettings = () => {
  const { data, loading, error } = useQuery<InventorySettingsResponse>(
    GET_INVENTORY_SETTINGS
  );

  return {
    settings: data?.inventorySettings,
    loading,
    error,
  };
};

export const useInventoryActions = () => {
  const [updateSettings] = useMutation<
    { updateInventorySettings: InventorySettingsResponse },
    { input: UpdateInventorySettingsInput }
  >(UPDATE_INVENTORY_SETTINGS);

  const [acknowledgeAlert] = useMutation<
    { acknowledgeInventoryAlert: AcknowledgeAlertResponse },
    { id: string }
  >(ACKNOWLEDGE_INVENTORY_ALERT);

  const [resolveAlert] = useMutation<
    { resolveInventoryAlert: ResolveAlertResponse },
    { id: string }
  >(RESOLVE_INVENTORY_ALERT);

  const [updateInventory] = useMutation<
    { updateInventory: InventoryTransactionResponse },
    { input: InventoryUpdateInput }
  >(UPDATE_INVENTORY);

  return {
    updateSettings,
    acknowledgeAlert,
    resolveAlert,
    updateInventory,
  };
};

export const useInventory = () => {
  const { data, loading, error } = useQuery<InventoryStatsResponse>(GET_INVENTORY_STATS);

  return {
    inventoryStats: data?.inventoryStats,
    loading,
    error,
  };
};
