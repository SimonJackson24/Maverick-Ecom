import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Grid,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useMutation } from '@apollo/client';
import { UPDATE_SHIPPING_RULE, DELETE_SHIPPING_RULE } from '../../graphql/shipping';

interface ShippingRule {
  id: string;
  name: string;
  priority: number;
  conditions: {
    type: 'weight' | 'price' | 'items' | 'destination';
    operator: 'gt' | 'lt' | 'eq' | 'between';
    value: number | [number, number];
    zone?: string;
  }[];
  actions: {
    type: 'fixed_rate' | 'free_shipping' | 'percentage_discount';
    value: number;
  }[];
  active: boolean;
}

interface ShippingRulesProps {
  rules?: ShippingRule[];
  loading?: boolean;
}

const ShippingRules: React.FC<ShippingRulesProps> = ({ rules = [], loading }) => {
  const [editRule, setEditRule] = useState<ShippingRule | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const [updateRule] = useMutation(UPDATE_SHIPPING_RULE);
  const [deleteRule] = useMutation(DELETE_SHIPPING_RULE);

  const handleSave = async (rule: ShippingRule) => {
    try {
      await updateRule({
        variables: {
          id: rule.id,
          input: rule,
        },
      });
      setOpenDialog(false);
    } catch (error) {
      console.error('Failed to update shipping rule:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteRule({
        variables: {
          id,
        },
      });
    } catch (error) {
      console.error('Failed to delete shipping rule:', error);
    }
  };

  const formatCondition = (condition: ShippingRule['conditions'][0]) => {
    const formatValue = (value: number | [number, number]) => {
      if (Array.isArray(value)) {
        return `${value[0]} - ${value[1]}`;
      }
      return value.toString();
    };

    const formatOperator = (op: string) => {
      switch (op) {
        case 'gt':
          return '>';
        case 'lt':
          return '<';
        case 'eq':
          return '=';
        case 'between':
          return 'between';
        default:
          return op;
      }
    };

    return `${condition.type} ${formatOperator(condition.operator)} ${formatValue(
      condition.value
    )}`;
  };

  const formatAction = (action: ShippingRule['actions'][0]) => {
    switch (action.type) {
      case 'fixed_rate':
        return `Fixed rate: £${action.value}`;
      case 'free_shipping':
        return 'Free shipping';
      case 'percentage_discount':
        return `${action.value}% discount`;
      default:
        return action.type;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6">Shipping Rules</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditRule(null);
            setOpenDialog(true);
          }}
        >
          Add Rule
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Conditions</TableCell>
              <TableCell>Actions</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rules.map((rule) => (
              <TableRow key={rule.id}>
                <TableCell>{rule.name}</TableCell>
                <TableCell>{rule.priority}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {rule.conditions.map((condition, index) => (
                      <Chip
                        key={index}
                        label={formatCondition(condition)}
                        size="small"
                      />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {rule.actions.map((action, index) => (
                      <Chip
                        key={index}
                        label={formatAction(action)}
                        size="small"
                      />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={rule.active ? 'Active' : 'Inactive'}
                    color={rule.active ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setEditRule(rule);
                      setOpenDialog(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(rule.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editRule ? 'Edit Shipping Rule' : 'New Shipping Rule'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Rule Name"
                value={editRule?.name || ''}
                onChange={(e) =>
                  setEditRule((prev) =>
                    prev ? { ...prev, name: e.target.value } : null
                  )
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Priority"
                value={editRule?.priority || 0}
                onChange={(e) =>
                  setEditRule((prev) =>
                    prev ? { ...prev, priority: Number(e.target.value) } : null
                  )
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={editRule?.active || false}
                    onChange={(e) =>
                      setEditRule((prev) =>
                        prev ? { ...prev, active: e.target.checked } : null
                      )
                    }
                  />
                }
                label="Active"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => editRule && handleSave(editRule)}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ShippingRules;
