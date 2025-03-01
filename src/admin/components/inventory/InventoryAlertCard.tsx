import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Stack,
  Box,
} from '@mui/material';
import { Warning, Error, CheckCircle } from '@mui/icons-material';
import { InventoryAlert, StockLevel } from '../../types/inventory';

interface InventoryAlertCardProps {
  alert: InventoryAlert;
  onAcknowledge: (alertId: string) => void;
  onResolve: (alertId: string) => void;
}

const getStatusIcon = (status: StockLevel) => {
  switch (status) {
    case 'LOW_STOCK':
      return <Warning color="warning" />;
    case 'OUT_OF_STOCK':
      return <Error color="error" />;
    default:
      return <CheckCircle color="success" />;
  }
};

const getStatusColor = (status: StockLevel) => {
  switch (status) {
    case 'LOW_STOCK':
      return 'warning';
    case 'OUT_OF_STOCK':
      return 'error';
    default:
      return 'success';
  }
};

const InventoryAlertCard: React.FC<InventoryAlertCardProps> = ({
  alert,
  onAcknowledge,
  onResolve,
}) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6" component="div" gutterBottom>
              {alert.productName}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" mb={1}>
              {getStatusIcon(alert.status)}
              <Chip
                label={alert.status.replace('_', ' ')}
                color={getStatusColor(alert.status) as any}
                size="small"
              />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Current Stock: {alert.currentStock}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Threshold: {alert.threshold}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            {!alert.acknowledgedAt && (
              <Button
                variant="outlined"
                size="small"
                onClick={() => onAcknowledge(alert.id)}
              >
                Acknowledge
              </Button>
            )}
            {!alert.resolvedAt && (
              <Button
                variant="contained"
                size="small"
                onClick={() => onResolve(alert.id)}
              >
                Resolve
              </Button>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default InventoryAlertCard;
