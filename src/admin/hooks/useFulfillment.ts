import { useQuery, useMutation, useSubscription } from '@apollo/client';
import {
  GET_FULFILLMENTS,
  GET_FULFILLMENT,
  GET_PICK_LISTS,
  CREATE_PICK_LIST,
  UPDATE_FULFILLMENT_STATUS,
  UPDATE_PICK_LIST,
  COMPLETE_PICK_LIST,
  GENERATE_PACKING_SLIP,
  FULFILLMENT_UPDATED_SUBSCRIPTION,
  PICK_LIST_UPDATED_SUBSCRIPTION,
} from '../../graphql/fulfillment';
import {
  FulfillmentStatus,
  PickListStatus,
  GetFulfillmentsResponse,
  GetFulfillmentResponse,
  GetPickListsResponse,
  CreatePickListResponse,
  UpdateFulfillmentStatusResponse,
  UpdatePickListResponse,
  CompletePickListResponse,
  GeneratePackingSlipResponse,
  UpdatePickListItemInput,
  FulfillmentUpdatedResponse,
  PickListUpdatedResponse,
} from '../../graphql/types/fulfillment';

export const useFulfillments = (status?: FulfillmentStatus[]) => {
  const { data, loading, error } = useQuery<GetFulfillmentsResponse>(
    GET_FULFILLMENTS,
    {
      variables: { status },
    }
  );

  useSubscription<FulfillmentUpdatedResponse>(FULFILLMENT_UPDATED_SUBSCRIPTION, {
    onData: ({ client, data }) => {
      if (data.data?.fulfillmentUpdated) {
        // Update cache with updated fulfillment
        const existingData = client.readQuery<GetFulfillmentsResponse>({
          query: GET_FULFILLMENTS,
          variables: { status },
        });

        if (existingData) {
          const updatedFulfillment = data.data.fulfillmentUpdated;
          client.writeQuery({
            query: GET_FULFILLMENTS,
            variables: { status },
            data: {
              fulfillments: existingData.fulfillments.map((f) =>
                f.id === updatedFulfillment.id ? updatedFulfillment : f
              ),
            },
          });
        }
      }
    },
  });

  return {
    fulfillments: data?.fulfillments || [],
    loading,
    error,
  };
};

export const useFulfillment = (id: string) => {
  const { data, loading, error } = useQuery<GetFulfillmentResponse>(
    GET_FULFILLMENT,
    {
      variables: { id },
    }
  );

  return {
    fulfillment: data?.fulfillment,
    loading,
    error,
  };
};

export const usePickLists = (status?: PickListStatus[]) => {
  const { data, loading, error } = useQuery<GetPickListsResponse>(
    GET_PICK_LISTS,
    {
      variables: { status },
    }
  );

  useSubscription<PickListUpdatedResponse>(PICK_LIST_UPDATED_SUBSCRIPTION, {
    onData: ({ client, data }) => {
      if (data.data?.pickListUpdated) {
        // Update cache with updated pick list
        const existingData = client.readQuery<GetPickListsResponse>({
          query: GET_PICK_LISTS,
          variables: { status },
        });

        if (existingData) {
          const updatedPickList = data.data.pickListUpdated;
          client.writeQuery({
            query: GET_PICK_LISTS,
            variables: { status },
            data: {
              pickLists: existingData.pickLists.map((pl) =>
                pl.id === updatedPickList.id ? updatedPickList : pl
              ),
            },
          });
        }
      }
    },
  });

  return {
    pickLists: data?.pickLists || [],
    loading,
    error,
  };
};

export const useFulfillmentActions = () => {
  const [createPickList] = useMutation<
    CreatePickListResponse,
    { fulfillmentIds: string[] }
  >(CREATE_PICK_LIST);

  const [updateFulfillmentStatus] = useMutation<
    UpdateFulfillmentStatusResponse,
    { id: string; status: FulfillmentStatus; notes?: string }
  >(UPDATE_FULFILLMENT_STATUS);

  const [updatePickList] = useMutation<
    UpdatePickListResponse,
    { id: string; items: UpdatePickListItemInput[] }
  >(UPDATE_PICK_LIST);

  const [completePickList] = useMutation<
    CompletePickListResponse,
    { id: string }
  >(COMPLETE_PICK_LIST);

  const [generatePackingSlip] = useMutation<
    GeneratePackingSlipResponse,
    { fulfillmentId: string }
  >(GENERATE_PACKING_SLIP);

  const handleCreatePickList = async (fulfillmentIds: string[]) => {
    try {
      const response = await createPickList({
        variables: { fulfillmentIds },
      });
      return response.data?.createPickList;
    } catch (error) {
      console.error('Error creating pick list:', error);
      throw error;
    }
  };

  const handleUpdateFulfillmentStatus = async (
    id: string,
    status: FulfillmentStatus,
    notes?: string
  ) => {
    try {
      const response = await updateFulfillmentStatus({
        variables: { id, status, notes },
      });
      return response.data?.updateFulfillmentStatus;
    } catch (error) {
      console.error('Error updating fulfillment status:', error);
      throw error;
    }
  };

  const handleUpdatePickList = async (
    id: string,
    items: UpdatePickListItemInput[]
  ) => {
    try {
      const response = await updatePickList({
        variables: { id, items },
      });
      return response.data?.updatePickList;
    } catch (error) {
      console.error('Error updating pick list:', error);
      throw error;
    }
  };

  const handleCompletePickList = async (id: string) => {
    try {
      const response = await completePickList({
        variables: { id },
      });
      return response.data?.completePickList;
    } catch (error) {
      console.error('Error completing pick list:', error);
      throw error;
    }
  };

  const handleGeneratePackingSlip = async (fulfillmentId: string) => {
    try {
      const response = await generatePackingSlip({
        variables: { fulfillmentId },
      });
      return response.data?.generatePackingSlip;
    } catch (error) {
      console.error('Error generating packing slip:', error);
      throw error;
    }
  };

  return {
    createPickList: handleCreatePickList,
    updateFulfillmentStatus: handleUpdateFulfillmentStatus,
    updatePickList: handleUpdatePickList,
    completePickList: handleCompletePickList,
    generatePackingSlip: handleGeneratePackingSlip,
  };
};
