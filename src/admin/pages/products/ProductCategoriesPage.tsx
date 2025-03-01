import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondary,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import AdobeCommerceService from '../../../services/AdobeCommerceService';
import RequirePermission from '../../components/auth/RequirePermission';

interface Category {
  id: string;
  name: string;
  description: string;
  parentId: string | null;
  position: number;
  isActive: boolean;
  productCount: number;
}

interface CategoryFormData {
  name: string;
  description: string;
  parentId: string | null;
  isActive: boolean;
}

const ProductCategoriesPage: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    parentId: null,
    isActive: true,
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await AdobeCommerceService.getInstance({
        baseUrl: import.meta.env.VITE_ADOBE_COMMERCE_URL || '',
        accessToken: import.meta.env.VITE_ADOBE_COMMERCE_ACCESS_TOKEN || '',
      }).getCategories();
      setCategories(response);
    } catch (error) {
      console.error('Error loading categories:', error);
      enqueueSnackbar('Failed to load categories', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description,
        parentId: category.parentId,
        isActive: category.isActive,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
        parentId: null,
        isActive: true,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      parentId: null,
      isActive: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const service = AdobeCommerceService.getInstance({
        baseUrl: import.meta.env.VITE_ADOBE_COMMERCE_URL || '',
        accessToken: import.meta.env.VITE_ADOBE_COMMERCE_ACCESS_TOKEN || '',
      });

      if (editingCategory) {
        await service.updateCategory(editingCategory.id, formData);
        enqueueSnackbar('Category updated successfully', { variant: 'success' });
      } else {
        await service.createCategory(formData);
        enqueueSnackbar('Category created successfully', { variant: 'success' });
      }

      handleCloseDialog();
      loadCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      enqueueSnackbar('Failed to save category', { variant: 'error' });
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      await AdobeCommerceService.getInstance({
        baseUrl: import.meta.env.VITE_ADOBE_COMMERCE_URL || '',
        accessToken: import.meta.env.VITE_ADOBE_COMMERCE_ACCESS_TOKEN || '',
      }).deleteCategory(categoryId);
      enqueueSnackbar('Category deleted successfully', { variant: 'success' });
      loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      enqueueSnackbar('Failed to delete category', { variant: 'error' });
    }
  };

  const handleMove = async (categoryId: string, direction: 'up' | 'down') => {
    const categoryIndex = categories.findIndex(c => c.id === categoryId);
    if (categoryIndex === -1) return;

    const newPosition = direction === 'up' ? 
      categories[categoryIndex].position - 1 : 
      categories[categoryIndex].position + 1;

    try {
      await AdobeCommerceService.getInstance({
        baseUrl: import.meta.env.VITE_ADOBE_COMMERCE_URL || '',
        accessToken: import.meta.env.VITE_ADOBE_COMMERCE_ACCESS_TOKEN || '',
      }).updateCategoryPosition(categoryId, newPosition);
      loadCategories();
    } catch (error) {
      console.error('Error moving category:', error);
      enqueueSnackbar('Failed to move category', { variant: 'error' });
    }
  };

  return (
    <RequirePermission permission="products.edit">
      <Box sx={{ p: 3 }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4">Product Categories</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Category
          </Button>
        </Box>

        <Card>
          <CardContent>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <List>
                {categories.map((category) => (
                  <ListItem
                    key={category.id}
                    secondaryAction={
                      <Box>
                        <Tooltip title="Move Up">
                          <IconButton
                            edge="end"
                            onClick={() => handleMove(category.id, 'up')}
                            disabled={category.position === 0}
                          >
                            <ArrowUpwardIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Move Down">
                          <IconButton
                            edge="end"
                            onClick={() => handleMove(category.id, 'down')}
                            disabled={category.position === categories.length - 1}
                          >
                            <ArrowDownwardIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            edge="end"
                            onClick={() => handleOpenDialog(category)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            edge="end"
                            onClick={() => handleDelete(category.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    }
                  >
                    <ListItemText
                      primary={category.name}
                      secondary={
                        <>
                          {category.description}
                          <br />
                          {`${category.productCount} products`}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>

        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <form onSubmit={handleSubmit}>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'New Category'}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  fullWidth
                />
                <TextField
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  multiline
                  rows={3}
                  fullWidth
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">
                {editingCategory ? 'Update' : 'Create'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </RequirePermission>
  );
};

export default ProductCategoriesPage;
