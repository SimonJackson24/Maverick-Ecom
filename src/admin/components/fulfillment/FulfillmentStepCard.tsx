import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Stepper,
  Step,
  StepLabel,
  Box,
} from '@mui/material';
import { Fulfillment, FulfillmentStatus } from '../../types/fulfillment';

interface FulfillmentStepCardProps {
  fulfillment: Fulfillment;
  onUpdateStatus: (status: FulfillmentStatus) => void;
}

const FULFILLMENT_STEPS: FulfillmentStatus[] = [
  'PENDING',
  'PROCESSING',
  'PICKED',
  'PACKED',
  'READY_FOR_SHIPPING',
  'SHIPPED',
];

const getStepIndex = (status: FulfillmentStatus): number => {
  return FULFILLMENT_STEPS.indexOf(status);
};

const FulfillmentStepCard: React.FC<FulfillmentStepCardProps> = ({
  fulfillment,
  onUpdateStatus,
}) => {
  const currentStep = getStepIndex(fulfillment.status);
  const nextStep = currentStep + 1;

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Order #{fulfillment.orderId}
        </Typography>

        <Stepper activeStep={currentStep} sx={{ my: 3 }}>
          {FULFILLMENT_STEPS.map((step, index) => (
            <Step key={step}>
              <StepLabel>{step.replace('_', ' ')}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Current Status
            </Typography>
            <Typography variant="body1">
              {fulfillment.status.replace('_', ' ')}
            </Typography>
          </Box>

          {fulfillment.pickedBy && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Picked By
              </Typography>
              <Typography variant="body1">{fulfillment.pickedBy}</Typography>
            </Box>
          )}

          {fulfillment.packedBy && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Packed By
              </Typography>
              <Typography variant="body1">{fulfillment.packedBy}</Typography>
            </Box>
          )}

          {fulfillment.shippingLabel && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Shipping Information
              </Typography>
              <Typography variant="body1">
                {fulfillment.shippingLabel.provider} -{' '}
                {fulfillment.shippingLabel.trackingNumber}
              </Typography>
            </Box>
          )}

          {nextStep < FULFILLMENT_STEPS.length && (
            <Button
              variant="contained"
              onClick={() => onUpdateStatus(FULFILLMENT_STEPS[nextStep])}
              fullWidth
            >
              Mark as {FULFILLMENT_STEPS[nextStep].replace('_', ' ')}
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default FulfillmentStepCard;
