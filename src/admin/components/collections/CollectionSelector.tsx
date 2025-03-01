import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  SelectChangeEvent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { Collection } from '../../types/Collection';
import { CollectionService } from '../../../services/CollectionService';
import CollectionForm from './CollectionForm';

interface CollectionSelectorProps {
  selectedCollections: string[];
  onChange: (collectionIds: string[]) => void;
}

const CollectionSelector: React.FC<CollectionSelectorProps> = ({
  selectedCollections,
  onChange,
}) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const collectionService = CollectionService.getInstance();

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      const response = await collectionService.getCollections();
      setCollections(response);
    } catch (error) {
      console.error('Error loading collections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    onChange(typeof value === 'string' ? value.split(',') : value);
  };

  const handleCreateCollection = async (collectionData: Partial<Collection>) => {
    try {
      const newCollection = await collectionService.createCollection(collectionData);
      setCollections([...collections, newCollection]);
      onChange([...selectedCollections, newCollection.id]);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating collection:', error);
    }
  };

  return (
    <Box>
      <FormControl fullWidth margin="normal">
        <InputLabel>Collections</InputLabel>
        <Select
          multiple
          value={selectedCollections}
          onChange={handleChange}
          input={<OutlinedInput label="Collections" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((collectionId) => {
                const collection = collections.find((c) => c.id === collectionId);
                return collection ? (
                  <Chip key={collectionId} label={collection.name} />
                ) : null;
              })}
            </Box>
          )}
          disabled={loading}
        >
          {collections.map((collection) => (
            <MenuItem key={collection.id} value={collection.id}>
              {collection.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <Button
        startIcon={<Add />}
        onClick={() => setIsCreateDialogOpen(true)}
        sx={{ mt: 1 }}
      >
        Create New Collection
      </Button>

      <Dialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Collection</DialogTitle>
        <DialogContent>
          <CollectionForm
            onSubmit={handleCreateCollection}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CollectionSelector;
