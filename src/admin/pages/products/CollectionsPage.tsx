import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Collection } from '../../types/Collection';
import { CollectionService } from '../../../services/CollectionService';
import CollectionForm from '../../components/collections/CollectionForm';
import { useSnackbar } from 'notistack';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const CollectionsPage: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState<Collection | null>(null);
  
  const collectionService = CollectionService.getInstance();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      const data = await collectionService.getCollections();
      setCollections(data.sort((a, b) => a.position - b.position));
    } catch (error) {
      enqueueSnackbar('Error loading collections', { variant: 'error' });
    }
  };

  const handleAddClick = () => {
    setSelectedCollection(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (collection: Collection) => {
    setSelectedCollection(collection);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (collection: Collection) => {
    setCollectionToDelete(collection);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!collectionToDelete) return;

    try {
      await collectionService.deleteCollection(collectionToDelete.id);
      enqueueSnackbar('Collection deleted successfully', { variant: 'success' });
      loadCollections();
    } catch (error) {
      enqueueSnackbar('Error deleting collection', { variant: 'error' });
    }
    setIsDeleteDialogOpen(false);
    setCollectionToDelete(null);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedCollection(null);
    loadCollections();
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(collections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedCollections = items.map((item, index) => ({
      ...item,
      position: index,
    }));

    setCollections(updatedCollections);

    try {
      await collectionService.updateCollectionPositions(
        updatedCollections.map((c) => ({ id: c.id, position: c.position }))
      );
      enqueueSnackbar('Collection order updated', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Error updating collection order', { variant: 'error' });
      loadCollections(); // Reload original order
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'position',
      headerName: '',
      width: 50,
      renderCell: () => <DragIcon />,
    },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 2 },
    {
      field: 'productCount',
      headerName: 'Products',
      width: 100,
      valueGetter: (params) => params.row.products.length,
    },
    { field: 'isActive', headerName: 'Active', width: 100, type: 'boolean' },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => handleEditClick(params.row)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => handleDeleteClick(params.row)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <h1 className="text-2xl font-semibold">Collections</h1>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
        >
          Add Collection
        </Button>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="collections" direction="vertical">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {collections.map((collection, index) => (
                  <Draggable
                    key={collection.id}
                    draggableId={collection.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Box sx={{ p: 2, border: '1px solid #e0e0e0', mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <DragIcon sx={{ mr: 2 }} />
                            <Box sx={{ flex: 1 }}>
                              <Box sx={{ fontWeight: 'bold' }}>{collection.name}</Box>
                              <Box sx={{ color: 'text.secondary' }}>{collection.description}</Box>
                            </Box>
                            <Box>
                              <Tooltip title="Edit">
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditClick(collection)}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteClick(collection)}
                                  color="error"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>
                        </Box>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Paper>

      <CollectionForm
        open={isFormOpen}
        onClose={handleFormClose}
        collection={selectedCollection || undefined}
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        title="Delete Collection"
        content="Are you sure you want to delete this collection? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setCollectionToDelete(null);
        }}
      />
    </div>
  );
};

export default CollectionsPage;
