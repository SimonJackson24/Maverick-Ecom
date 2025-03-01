import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Tooltip,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { ScentManagementService } from '../../services/ScentManagementService';
import { ScentRule, ScentRuleInput, ScentRuleCondition } from '../../types';
import AdminLayout from '../../components/layout/AdminLayout';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useSnackbar } from 'notistack';

const OPERATORS = ['EQUALS', 'CONTAINS', 'GREATER_THAN', 'LESS_THAN', 'IN_RANGE'];
const ATTRIBUTES = [
  'primary_notes',
  'middle_notes',
  'base_notes',
  'intensity',
  'mood',
  'season',
];

interface RuleDialogState {
  name: string;
  description: string;
  conditions: ScentRuleCondition[];
  priority: number;
  isActive: boolean;
}

const RecommendationRulesPage: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [rules, setRules] = useState<ScentRule[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<RuleDialogState | null>(null);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<ScentRule | null>(null);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [ruleAnalytics, setRuleAnalytics] = useState<any>(null);

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    try {
      setLoading(true);
      const response = await ScentManagementService.getRecommendationRules();
      setRules(response);
    } catch (error) {
      enqueueSnackbar('Failed to load recommendation rules', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (rule?: ScentRule) => {
    if (rule) {
      setEditingRule({
        name: rule.name,
        description: rule.description,
        conditions: [...rule.conditions],
        priority: rule.priority,
        isActive: rule.isActive,
      });
      setEditMode(rule.id);
    } else {
      setEditingRule({
        name: '',
        description: '',
        conditions: [],
        priority: rules.length + 1,
        isActive: true,
      });
      setEditMode(null);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingRule(null);
    setEditMode(null);
  };

  const handleAddCondition = () => {
    if (!editingRule) return;
    setEditingRule({
      ...editingRule,
      conditions: [
        ...editingRule.conditions,
        { attribute: '', operator: 'EQUALS', value: '' },
      ],
    });
  };

  const handleRemoveCondition = (index: number) => {
    if (!editingRule) return;
    setEditingRule({
      ...editingRule,
      conditions: editingRule.conditions.filter((_, i) => i !== index),
    });
  };

  const handleConditionChange = (
    index: number,
    field: keyof ScentRuleCondition,
    value: string
  ) => {
    if (!editingRule) return;
    setEditingRule({
      ...editingRule,
      conditions: editingRule.conditions.map((condition, i) =>
        i === index ? { ...condition, [field]: value } : condition
      ),
    });
  };

  const handleSave = async () => {
    if (!editingRule) return;

    try {
      const ruleInput: ScentRuleInput = {
        name: editingRule.name,
        description: editingRule.description,
        conditions: editingRule.conditions,
        priority: editingRule.priority,
        isActive: editingRule.isActive,
      };

      if (editMode) {
        await ScentManagementService.updateRecommendationRule(editMode, ruleInput);
        enqueueSnackbar('Rule updated successfully', { variant: 'success' });
      } else {
        await ScentManagementService.createRecommendationRule(ruleInput);
        enqueueSnackbar('Rule created successfully', { variant: 'success' });
      }
      handleCloseDialog();
      loadRules();
    } catch (error) {
      enqueueSnackbar('Failed to save rule', { variant: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!selectedRule) return;

    try {
      await ScentManagementService.deleteRecommendationRule(selectedRule.id);
      enqueueSnackbar('Rule deleted successfully', { variant: 'success' });
      setDeleteConfirmOpen(false);
      loadRules();
    } catch (error) {
      enqueueSnackbar('Failed to delete rule', { variant: 'error' });
    }
  };

  const handleMovePriority = async (ruleId: string, direction: 'up' | 'down') => {
    const currentIndex = rules.findIndex((r) => r.id === ruleId);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === rules.length - 1)
    )
      return;

    const newRules = [...rules];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    [newRules[currentIndex], newRules[targetIndex]] = [
      newRules[targetIndex],
      newRules[currentIndex],
    ];

    try {
      // Update priorities in the backend
      await Promise.all(
        newRules.map((rule, index) =>
          ScentManagementService.updateRecommendationRule(rule.id, {
            ...rule,
            priority: index + 1,
          })
        )
      );
      setRules(newRules);
      enqueueSnackbar('Rule priority updated', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to update rule priority', { variant: 'error' });
    }
  };

  const handleViewAnalytics = async (ruleId: string) => {
    try {
      const analytics = await ScentManagementService.getRecommendationAnalytics({
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        end: new Date(),
      });
      setRuleAnalytics(
        analytics.rulePerformance.find((perf) => perf.ruleId === ruleId)
      );
      setAnalyticsOpen(true);
    } catch (error) {
      enqueueSnackbar('Failed to load rule analytics', { variant: 'error' });
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <AdminLayout>
      <Box p={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h4">Recommendation Rules</Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
              >
                Add Rule
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Priority</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Conditions</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rules.map((rule, index) => (
                        <TableRow key={rule.id}>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              {rule.priority}
                              <Box>
                                <IconButton
                                  size="small"
                                  onClick={() => handleMovePriority(rule.id, 'up')}
                                  disabled={index === 0}
                                >
                                  <ArrowUpwardIcon />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleMovePriority(rule.id, 'down')}
                                  disabled={index === rules.length - 1}
                                >
                                  <ArrowDownwardIcon />
                                </IconButton>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>{rule.name}</TableCell>
                          <TableCell>{rule.description}</TableCell>
                          <TableCell>
                            {rule.conditions.map((condition, i) => (
                              <Typography key={i} variant="body2" color="textSecondary">
                                {condition.attribute} {condition.operator} {condition.value}
                              </Typography>
                            ))}
                          </TableCell>
                          <TableCell>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={rule.isActive}
                                  onChange={async () => {
                                    try {
                                      await ScentManagementService.updateRecommendationRule(
                                        rule.id,
                                        {
                                          ...rule,
                                          isActive: !rule.isActive,
                                        }
                                      );
                                      loadRules();
                                    } catch (error) {
                                      enqueueSnackbar('Failed to update rule status', {
                                        variant: 'error',
                                      });
                                    }
                                  }}
                                />
                              }
                              label={rule.isActive ? 'Active' : 'Inactive'}
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDialog(rule)}
                              color="primary"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => {
                                setSelectedRule(rule);
                                setDeleteConfirmOpen(true);
                              }}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                            <Tooltip title="View Analytics">
                              <IconButton
                                size="small"
                                onClick={() => handleViewAnalytics(rule.id)}
                                color="info"
                              >
                                <InfoIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {editMode ? 'Edit Recommendation Rule' : 'New Recommendation Rule'}
          </DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={2} pt={1}>
              <TextField
                label="Name"
                fullWidth
                value={editingRule?.name || ''}
                onChange={(e) =>
                  setEditingRule((prev) =>
                    prev ? { ...prev, name: e.target.value } : null
                  )
                }
              />

              <TextField
                label="Description"
                fullWidth
                multiline
                rows={2}
                value={editingRule?.description || ''}
                onChange={(e) =>
                  setEditingRule((prev) =>
                    prev ? { ...prev, description: e.target.value } : null
                  )
                }
              />

              <Typography variant="h6" gutterBottom>
                Conditions
              </Typography>

              {editingRule?.conditions.map((condition, index) => (
                <Box key={index} display="flex" gap={2} alignItems="center">
                  <FormControl fullWidth>
                    <InputLabel>Attribute</InputLabel>
                    <Select
                      value={condition.attribute}
                      onChange={(e) =>
                        handleConditionChange(index, 'attribute', e.target.value)
                      }
                      label="Attribute"
                    >
                      {ATTRIBUTES.map((attr) => (
                        <MenuItem key={attr} value={attr}>
                          {attr.replace('_', ' ')}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>Operator</InputLabel>
                    <Select
                      value={condition.operator}
                      onChange={(e) =>
                        handleConditionChange(index, 'operator', e.target.value)
                      }
                      label="Operator"
                    >
                      {OPERATORS.map((op) => (
                        <MenuItem key={op} value={op}>
                          {op.replace('_', ' ')}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    label="Value"
                    fullWidth
                    value={condition.value}
                    onChange={(e) =>
                      handleConditionChange(index, 'value', e.target.value)
                    }
                  />

                  <IconButton
                    color="error"
                    onClick={() => handleRemoveCondition(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}

              <Button
                startIcon={<AddIcon />}
                onClick={handleAddCondition}
                variant="outlined"
              >
                Add Condition
              </Button>

              <FormControlLabel
                control={
                  <Switch
                    checked={editingRule?.isActive || false}
                    onChange={(e) =>
                      setEditingRule((prev) =>
                        prev ? { ...prev, isActive: e.target.checked } : null
                      )
                    }
                  />
                }
                label="Active"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} startIcon={<CancelIcon />}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this recommendation rule? This action cannot be
            undone.
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={analyticsOpen}
          onClose={() => setAnalyticsOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Rule Performance Analytics</DialogTitle>
          <DialogContent>
            {ruleAnalytics && (
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Conversions
                    </Typography>
                    <Typography variant="h4">{ruleAnalytics.conversions}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Impressions
                    </Typography>
                    <Typography variant="h4">{ruleAnalytics.impressions}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Click-through Rate
                    </Typography>
                    <Typography variant="h4">
                      {(ruleAnalytics.clickThroughRate * 100).toFixed(2)}%
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAnalyticsOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AdminLayout>
  );
};

export default RecommendationRulesPage;
