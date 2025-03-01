import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  Alert,
  Stack,
  CircularProgress,
} from '@mui/material';
import FulfillmentStepCard from '../../components/fulfillment/FulfillmentStepCard';
import PickListCard from '../../components/fulfillment/PickListCard';
import { useFulfillments, usePickLists, useFulfillmentActions } from '../../hooks/useFulfillment';
import { UpdatePickListItemInput } from '../../graphql/types/fulfillment';

const FulfillmentPage: React.FC = () => {
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const { fulfillments, loading: fulfillmentsLoading } = useFulfillments();
  const { pickLists, loading: pickListsLoading } = usePickLists();
  const {
    createPickList,
    updateFulfillmentStatus,
    updatePickList,
    completePickList,
    generatePackingSlip,
  } = useFulfillmentActions();

  const handleUpdateFulfillmentStatus = async (
    fulfillmentId: string,
    status: string
  ) => {
    try {
      await updateFulfillmentStatus(fulfillmentId, status);
      setSuccessMessage(`Fulfillment status updated to ${status}`);
    } catch (error) {
      setErrorMessage('Failed to update fulfillment status');
    }
  };

  const handleUpdatePickedQuantity = async (
    pickListId: string,
    productId: string,
    quantity: number
  ) => {
    try {
      const items: UpdatePickListItemInput[] = [
        { productId, pickedQuantity: quantity },
      ];
      await updatePickList(pickListId, items);
    } catch (error) {
      setErrorMessage('Failed to update picked quantity');
    }
  };

  const handleCompletePickList = async (pickListId: string) => {
    try {
      await completePickList(pickListId);
      setSuccessMessage('Pick list completed successfully');
    } catch (error) {
      setErrorMessage('Failed to complete pick list');
    }
  };

  const handleCreatePickList = async () => {
    try {
      const pendingFulfillments = fulfillments
        .filter((f) => f.status === 'PENDING')
        .map((f) => f.id);

      if (pendingFulfillments.length === 0) {
        setErrorMessage('No pending fulfillments to create pick list');
        return;
      }

      await createPickList(pendingFulfillments);
      setSuccessMessage('New pick list created successfully');
    } catch (error) {
      setErrorMessage('Failed to create pick list');
    }
  };

  if (fulfillmentsLoading || pickListsLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Order Fulfillment
        </Typography>
      </Box>

      {successMessage && (
        <Alert
          severity="success"
          onClose={() => setSuccessMessage('')}
          sx={{ mb: 2 }}
        >
          {successMessage}
        </Alert>
      )}

      {errorMessage && (
        <Alert
          severity="error"
          onClose={() => setErrorMessage('')}
          sx={{ mb: 2 }}
        >
          {errorMessage}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Active Fulfillments</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreatePickList}
              >
                Create Pick List
              </Button>
            </Box>

            {fulfillments.length === 0 ? (
              <Alert severity="info">No active fulfillments</Alert>
            ) : (
              fulfillments.map((fulfillment) => (
                <FulfillmentStepCard
                  key={fulfillment.id}
                  fulfillment={fulfillment}
                  onUpdateStatus={(status) =>
                    handleUpdateFulfillmentStatus(fulfillment.id, status)
                  }
                />
              ))
            )}
          </Stack>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={2}>
            <Typography variant="h6">Active Pick Lists</Typography>
            {pickLists.length === 0 ? (
              <Alert severity="info">No active pick lists</Alert>
            ) : (
              pickLists.map((pickList) => (
                <PickListCard
                  key={pickList.id}
                  pickList={pickList}
                  onUpdatePickedQuantity={(productId, quantity) =>
                    handleUpdatePickedQuantity(pickList.id, productId, quantity)
                  }
                  onComplete={() => handleCompletePickList(pickList.id)}
                />
              ))
            )}
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
};

export default FulfillmentPage;
