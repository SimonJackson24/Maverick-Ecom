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
  Chip,
  Autocomplete,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { ScentManagementService } from '../../services/ScentManagementService';
import { ScentAttribute, ScentAttributeInput } from '../../types';
import AdminLayout from '../../components/layout/AdminLayout';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useSnackbar } from 'notistack';

const SCENT_TYPES = ['FLORAL', 'WOODY', 'CITRUS', 'SPICY', 'FRESH', 'SWEET', 'EARTHY'];
const SCENT_CATEGORIES = ['TOP_NOTE', 'MIDDLE_NOTE', 'BASE_NOTE'];

const ScentAttributesPage: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [attributes, setAttributes] = useState<ScentAttribute[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState<ScentAttributeInput | null>(null);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedAttribute, setSelectedAttribute] = useState<ScentAttribute | null>(null);

  useEffect(() => {
    loadAttributes();
  }, []);

  const loadAttributes = async () => {
    try {
      setLoading(true);
      const response = await ScentManagementService.getScentAttributes();
      setAttributes(response);
    } catch (error) {
      enqueueSnackbar('Failed to load scent attributes', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (attribute?: ScentAttribute) => {
    if (attribute) {
      setEditingAttribute({
        name: attribute.name,
        type: attribute.type,
        intensity: attribute.intensity,
        category: attribute.category,
        description: attribute.description,
        relatedNotes: attribute.relatedNotes,
      });
    } else {
      setEditingAttribute({
        name: '',
        type: '',
        intensity: 5,
        category: '',
        description: '',
        relatedNotes: [],
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingAttribute(null);
  };

  const handleSave = async () => {
    if (!editingAttribute) return;

    try {
      if (editMode) {
        await ScentManagementService.updateScentAttribute(editMode, editingAttribute);
        enqueueSnackbar('Scent attribute updated successfully', { variant: 'success' });
      } else {
        await ScentManagementService.createScentAttribute(editingAttribute);
        enqueueSnackbar('Scent attribute created successfully', { variant: 'success' });
      }
      handleCloseDialog();
      loadAttributes();
    } catch (error) {
      enqueueSnackbar('Failed to save scent attribute', { variant: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!selectedAttribute) return;

    try {
      // Note: Add delete functionality to ScentManagementService if needed
      await ScentManagementService.deleteScentAttribute(selectedAttribute.id);
      enqueueSnackbar('Scent attribute deleted successfully', { variant: 'success' });
      setDeleteConfirmOpen(false);
      loadAttributes();
    } catch (error) {
      enqueueSnackbar('Failed to delete scent attribute', { variant: 'error' });
    }
  };

  const confirmDelete = (attribute: ScentAttribute) => {
    setSelectedAttribute(attribute);
    setDeleteConfirmOpen(true);
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
              <Typography variant="h4">Scent Attributes</Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
              >
                Add Scent Attribute
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
                        <TableCell>Name</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Intensity</TableCell>
                        <TableCell>Related Notes</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {attributes.map((attribute) => (
                        <TableRow key={attribute.id}>
                          <TableCell>{attribute.name}</TableCell>
                          <TableCell>
                            <Chip label={attribute.type} color="primary" size="small" />
                          </TableCell>
                          <TableCell>{attribute.category}</TableCell>
                          <TableCell>{attribute.intensity}</TableCell>
                          <TableCell>
                            <Box display="flex" gap={0.5} flexWrap="wrap">
                              {attribute.relatedNotes.map((note, index) => (
                                <Chip key={index} label={note} size="small" />
                              ))}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => {
                                setEditMode(attribute.id);
                                handleOpenDialog(attribute);
                              }}
                              color="primary"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => confirmDelete(attribute)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
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
            {editMode ? 'Edit Scent Attribute' : 'New Scent Attribute'}
          </DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={2} pt={1}>
              <TextField
                label="Name"
                fullWidth
                value={editingAttribute?.name || ''}
                onChange={(e) =>
                  setEditingAttribute(prev => prev ? { ...prev, name: e.target.value } : null)
                }
              />

              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={editingAttribute?.type || ''}
                  onChange={(e) =>
                    setEditingAttribute(prev => prev ? { ...prev, type: e.target.value } : null)
                  }
                  label="Type"
                >
                  {SCENT_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={editingAttribute?.category || ''}
                  onChange={(e) =>
                    setEditingAttribute(prev => prev ? { ...prev, category: e.target.value } : null)
                  }
                  label="Category"
                >
                  {SCENT_CATEGORIES.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category.replace('_', ' ')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Intensity"
                type="number"
                fullWidth
                value={editingAttribute?.intensity || 5}
                onChange={(e) =>
                  setEditingAttribute(prev =>
                    prev ? { ...prev, intensity: parseInt(e.target.value) } : null
                  )
                }
                inputProps={{ min: 1, max: 10 }}
              />

              <TextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={editingAttribute?.description || ''}
                onChange={(e) =>
                  setEditingAttribute(prev => prev ? { ...prev, description: e.target.value } : null)
                }
              />

              <Autocomplete
                multiple
                freeSolo
                options={[]}
                value={editingAttribute?.relatedNotes || []}
                onChange={(_, newValue) =>
                  setEditingAttribute(prev => prev ? { ...prev, relatedNotes: newValue } : null)
                }
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip label={option} {...getTagProps({ index })} />
                  ))
                }
                renderInput={(params) => (
                  <TextField {...params} label="Related Notes" placeholder="Add note" />
                )}
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
            Are you sure you want to delete this scent attribute? This action cannot be undone.
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AdminLayout>
  );
};

export default ScentAttributesPage;
