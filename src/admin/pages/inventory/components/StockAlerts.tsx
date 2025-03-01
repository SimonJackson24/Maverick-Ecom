import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';

const GET_STOCK_ALERTS = gql`
  query GetStockAlerts {
    stockAlerts {
      id
      productId
      productName
      currentStock
      threshold
      status
      lastTriggered
      notificationType
      recipients
      customMessage
    }
  }
`;

const UPDATE_STOCK_ALERT = gql`
  mutation UpdateStockAlert($input: UpdateStockAlertInput!) {
    updateStockAlert(input: $input) {
      id
      threshold
      notificationType
      recipients
      customMessage
    }
  }
`;

const DELETE_STOCK_ALERT = gql`
  mutation DeleteStockAlert($id: ID!) {
    deleteStockAlert(id: $id)
  }
`;

interface StockAlert {
  id: string;
  productId: string;
  productName: string;
  currentStock: number;
  threshold: number;
  status: 'OK' | 'WARNING' | 'CRITICAL';
  lastTriggered: string;
  notificationType: 'EMAIL' | 'SLACK' | 'BOTH';
  recipients: string[];
  customMessage?: string;
}

const StockAlerts: React.FC = () => {
  const { data, loading, error } = useQuery(GET_STOCK_ALERTS);
  const [updateAlert] = useMutation(UPDATE_STOCK_ALERT);
  const [deleteAlert] = useMutation(DELETE_STOCK_ALERT);

  const [selectedAlert, setSelectedAlert] = useState<StockAlert | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    threshold: 0,
    notificationType: 'EMAIL',
    recipients: [] as string[],
    customMessage: '',
  });

  const handleEditClick = (alert: StockAlert) => {
    setSelectedAlert(alert);
    setEditForm({
      threshold: alert.threshold,
      notificationType: alert.notificationType,
      recipients: alert.recipients,
      customMessage: alert.customMessage || '',
    });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!selectedAlert) return;

    try {
      await updateAlert({
        variables: {
          input: {
            id: selectedAlert.id,
            ...editForm,
          },
        },
      });
      setEditDialogOpen(false);
    } catch (err) {
      console.error('Error updating alert:', err);
    }
  };

  const handleDeleteAlert = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this alert?')) return;

    try {
      await deleteAlert({
        variables: { id },
        update: (cache) => {
          const existingAlerts = cache.readQuery<{ stockAlerts: StockAlert[] }>({
            query: GET_STOCK_ALERTS,
          });
          if (existingAlerts) {
            cache.writeQuery({
              query: GET_STOCK_ALERTS,
              data: {
                stockAlerts: existingAlerts.stockAlerts.filter(
                  (alert) => alert.id !== id
                ),
              },
            });
          }
        },
      });
    } catch (err) {
      console.error('Error deleting alert:', err);
    }
  };

  const getStatusColor = (status: StockAlert['status']) => {
    switch (status) {
      case 'CRITICAL':
        return 'error';
      case 'WARNING':
        return 'warning';
      default:
        return 'success';
    }
  };

  if (loading) return <Box p={3}>Loading alerts...</Box>;
  if (error) return <Alert severity="error">Error loading alerts</Alert>;

  return (
    <Box p={3}>
      <Paper elevation={2}>
        <Box p={3}>
          <Typography variant="h5" gutterBottom>
            Stock Alerts
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="right">Current Stock</TableCell>
                  <TableCell align="right">Threshold</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Notification Type</TableCell>
                  <TableCell>Last Triggered</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.stockAlerts.map((alert: StockAlert) => (
                  <TableRow key={alert.id}>
                    <TableCell>{alert.productName}</TableCell>
                    <TableCell align="right">{alert.currentStock}</TableCell>
                    <TableCell align="right">{alert.threshold}</TableCell>
                    <TableCell>
                      <Chip
                        label={alert.status}
                        color={getStatusColor(alert.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<NotificationsIcon />}
                        label={alert.notificationType}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(alert.lastTriggered).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleEditClick(alert)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteAlert(alert.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Alert</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Threshold"
              type="number"
              value={editForm.threshold}
              onChange={(e) =>
                setEditForm((prev) => ({
                  ...prev,
                  threshold: parseInt(e.target.value) || 0,
                }))
              }
              margin="normal"
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Notification Type</InputLabel>
              <Select
                value={editForm.notificationType}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    notificationType: e.target.value as 'EMAIL' | 'SLACK' | 'BOTH',
                  }))
                }
              >
                <MenuItem value="EMAIL">Email</MenuItem>
                <MenuItem value="SLACK">Slack</MenuItem>
                <MenuItem value="BOTH">Both</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Recipients (comma-separated)"
              value={editForm.recipients.join(', ')}
              onChange={(e) =>
                setEditForm((prev) => ({
                  ...prev,
                  recipients: e.target.value.split(',').map((r) => r.trim()),
                }))
              }
              margin="normal"
            />

            <TextField
              fullWidth
              label="Custom Message"
              multiline
              rows={3}
              value={editForm.customMessage}
              onChange={(e) =>
                setEditForm((prev) => ({
                  ...prev,
                  customMessage: e.target.value,
                }))
              }
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StockAlerts;
