import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Chip,
} from '@mui/material';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import PageLayout from '../../components/layout/PageLayout';

interface Collection {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  featuredImage: string;
  productCount: number;
  startDate?: string;
  endDate?: string;
}

const CollectionsPage: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [collectionName, setCollectionName] = useState('');
  const [collectionDescription, setCollectionDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    // TODO: Replace with actual API call
    const mockCollections: Collection[] = [
      {
        id: '1',
        name: 'Spring Collection',
        description: 'Fresh and floral scents for spring',
        isActive: true,
        featuredImage: '/images/spring.jpg',
        productCount: 12,
        startDate: '2025-03-01',
        endDate: '2025-05-31',
      },
      {
        id: '2',
        name: 'Summer Essentials',
        description: 'Light and refreshing summer fragrances',
        isActive: true,
        featuredImage: '/images/summer.jpg',
        productCount: 8,
        startDate: '2025-06-01',
        endDate: '2025-08-31',
      },
    ];
    setCollections(mockCollections);
  };

  const handleOpenDialog = (collection?: Collection) => {
    if (collection) {
      setEditingCollection(collection);
      setCollectionName(collection.name);
      setCollectionDescription(collection.description);
      setIsActive(collection.isActive);
      setStartDate(collection.startDate || '');
      setEndDate(collection.endDate || '');
    } else {
      setEditingCollection(null);
      setCollectionName('');
      setCollectionDescription('');
      setIsActive(true);
      setStartDate('');
      setEndDate('');
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCollection(null);
    setCollectionName('');
    setCollectionDescription('');
    setIsActive(true);
    setStartDate('');
    setEndDate('');
  };

  const handleSaveCollection = async () => {
    try {
      if (editingCollection) {
        // TODO: Replace with actual API call
        const updatedCollections = collections.map(col =>
          col.id === editingCollection.id
            ? {
                ...col,
                name: collectionName,
                description: collectionDescription,
                isActive,
                startDate,
                endDate,
              }
            : col
        );
        setCollections(updatedCollections);
        enqueueSnackbar('Collection updated successfully', { variant: 'success' });
      } else {
        // TODO: Replace with actual API call
        const newCollection: Collection = {
          id: String(Date.now()),
          name: collectionName,
          description: collectionDescription,
          isActive,
          featuredImage: '',
          productCount: 0,
          startDate,
          endDate,
        };
        setCollections([...collections, newCollection]);
        enqueueSnackbar('Collection created successfully', { variant: 'success' });
      }
      handleCloseDialog();
    } catch (error) {
      enqueueSnackbar('Error saving collection', { variant: 'error' });
    }
  };

  const handleDeleteCollection = async (collectionId: string) => {
    try {
      // TODO: Replace with actual API call
      setCollections(collections.filter(col => col.id !== collectionId));
      enqueueSnackbar('Collection deleted successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Error deleting collection', { variant: 'error' });
    }
  };

  return (
    <PageLayout title="Collections">
      <Box>
        <Box display="flex" justifyContent="flex-end" mb={3}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            Add Collection
          </Button>
        </Box>

        <Grid container spacing={3}>
          {collections.map((collection) => (
            <Grid item xs={12} sm={6} md={4} key={collection.id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" component="div">
                      {collection.name}
                    </Typography>
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(collection)}
                        sx={{ mr: 1 }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteCollection(collection.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>

                  <Typography color="textSecondary" paragraph>
                    {collection.description}
                  </Typography>

                  <Box display="flex" gap={1} mb={2}>
                    <Chip
                      label={collection.isActive ? 'Active' : 'Inactive'}
                      color={collection.isActive ? 'success' : 'default'}
                      size="small"
                    />
                    <Chip
                      label={`${collection.productCount} Products`}
                      color="primary"
                      size="small"
                    />
                  </Box>

                  {collection.startDate && collection.endDate && (
                    <Typography variant="body2" color="textSecondary">
                      {new Date(collection.startDate).toLocaleDateString()} -{' '}
                      {new Date(collection.endDate).toLocaleDateString()}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingCollection ? 'Edit Collection' : 'Add Collection'}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Collection Name"
              fullWidth
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={collectionDescription}
              onChange={(e) => setCollectionDescription(e.target.value)}
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  color="primary"
                />
              }
              label="Active"
              sx={{ mb: 2 }}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  type="date"
                  label="Start Date"
                  fullWidth
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  type="date"
                  label="End Date"
                  fullWidth
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSaveCollection} color="primary" variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </PageLayout>
  );
};

export default CollectionsPage;
