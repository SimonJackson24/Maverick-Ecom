import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import { Add, Edit, Delete, DragIndicator } from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useSnackbar } from 'notistack';
import PageLayout from '../../components/layout/PageLayout';

interface Category {
  id: string;
  name: string;
  description: string;
  parentId: string | null;
  order: number;
}

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    // TODO: Replace with actual API call
    const mockCategories: Category[] = [
      { id: '1', name: 'Candles', description: 'All candle products', parentId: null, order: 0 },
      { id: '2', name: 'Wax Melts', description: 'Wax melts and warmers', parentId: null, order: 1 },
      { id: '3', name: 'Accessories', description: 'Candle accessories', parentId: null, order: 2 },
    ];
    setCategories(mockCategories);
  };

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setCategoryName(category.name);
      setCategoryDescription(category.description);
    } else {
      setEditingCategory(null);
      setCategoryName('');
      setCategoryDescription('');
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCategory(null);
    setCategoryName('');
    setCategoryDescription('');
  };

  const handleSaveCategory = async () => {
    try {
      if (editingCategory) {
        // TODO: Replace with actual API call
        const updatedCategories = categories.map(cat =>
          cat.id === editingCategory.id
            ? { ...cat, name: categoryName, description: categoryDescription }
            : cat
        );
        setCategories(updatedCategories);
        enqueueSnackbar('Category updated successfully', { variant: 'success' });
      } else {
        // TODO: Replace with actual API call
        const newCategory: Category = {
          id: String(Date.now()),
          name: categoryName,
          description: categoryDescription,
          parentId: null,
          order: categories.length,
        };
        setCategories([...categories, newCategory]);
        enqueueSnackbar('Category created successfully', { variant: 'success' });
      }
      handleCloseDialog();
    } catch (error) {
      enqueueSnackbar('Error saving category', { variant: 'error' });
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      // TODO: Replace with actual API call
      setCategories(categories.filter(cat => cat.id !== categoryId));
      enqueueSnackbar('Category deleted successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Error deleting category', { variant: 'error' });
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(categories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    setCategories(updatedItems);
  };

  return (
    <PageLayout title="Categories">
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Categories</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            Add Category
          </Button>
        </Box>

        <Card>
          <CardContent>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="categories">
                {(provided) => (
                  <List {...provided.droppableProps} ref={provided.innerRef}>
                    {categories.map((category, index) => (
                      <Draggable key={category.id} draggableId={category.id} index={index}>
                        {(provided) => (
                          <ListItem
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{ borderBottom: 1, borderColor: 'divider' }}
                          >
                            <DragIndicator sx={{ mr: 2, color: 'text.secondary' }} />
                            <ListItemText
                              primary={category.name}
                              secondary={category.description}
                            />
                            <ListItemSecondaryAction>
                              <IconButton
                                edge="end"
                                aria-label="edit"
                                onClick={() => handleOpenDialog(category)}
                                sx={{ mr: 1 }}
                              >
                                <Edit />
                              </IconButton>
                              <IconButton
                                edge="end"
                                aria-label="delete"
                                onClick={() => handleDeleteCategory(category.id)}
                              >
                                <Delete />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </List>
                )}
              </Droppable>
            </DragDropContext>
          </CardContent>
        </Card>

        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingCategory ? 'Edit Category' : 'Add Category'}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Category Name"
              fullWidth
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={categoryDescription}
              onChange={(e) => setCategoryDescription(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSaveCategory} color="primary" variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </PageLayout>
  );
};

export default CategoriesPage;
