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
  Autocomplete,
  Chip,
  Rating,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import PageLayout from '../../components/layout/PageLayout';

interface Scent {
  id: string;
  name: string;
  description: string;
  category: string;
  intensity: number;
  notes: string[];
  season: string[];
  mood: string[];
}

const SCENT_CATEGORIES = ['Floral', 'Woody', 'Citrus', 'Fresh', 'Sweet', 'Spicy', 'Earthy'];
const SEASONS = ['Spring', 'Summer', 'Fall', 'Winter'];
const MOODS = ['Relaxing', 'Energizing', 'Romantic', 'Fresh', 'Cozy', 'Tropical'];

const ScentsPage: React.FC = () => {
  const [scents, setScents] = useState<Scent[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingScent, setEditingScent] = useState<Scent | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [intensity, setIntensity] = useState(3);
  const [notes, setNotes] = useState<string[]>([]);
  const [season, setSeason] = useState<string[]>([]);
  const [mood, setMood] = useState<string[]>([]);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    loadScents();
  }, []);

  const loadScents = async () => {
    // TODO: Replace with actual API call
    const mockScents: Scent[] = [
      {
        id: '1',
        name: 'Lavender Dreams',
        description: 'Calming lavender with hints of vanilla',
        category: 'Floral',
        intensity: 3,
        notes: ['Lavender', 'Vanilla', 'Bergamot'],
        season: ['Spring', 'Summer'],
        mood: ['Relaxing', 'Cozy'],
      },
      {
        id: '2',
        name: 'Citrus Burst',
        description: 'Energizing blend of citrus fruits',
        category: 'Citrus',
        intensity: 4,
        notes: ['Orange', 'Lemon', 'Grapefruit'],
        season: ['Summer'],
        mood: ['Energizing', 'Fresh'],
      },
    ];
    setScents(mockScents);
  };

  const handleOpenDialog = (scent?: Scent) => {
    if (scent) {
      setEditingScent(scent);
      setName(scent.name);
      setDescription(scent.description);
      setCategory(scent.category);
      setIntensity(scent.intensity);
      setNotes(scent.notes);
      setSeason(scent.season);
      setMood(scent.mood);
    } else {
      setEditingScent(null);
      setName('');
      setDescription('');
      setCategory('');
      setIntensity(3);
      setNotes([]);
      setSeason([]);
      setMood([]);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingScent(null);
    setName('');
    setDescription('');
    setCategory('');
    setIntensity(3);
    setNotes([]);
    setSeason([]);
    setMood([]);
  };

  const handleSaveScent = async () => {
    try {
      if (editingScent) {
        // TODO: Replace with actual API call
        const updatedScents = scents.map(s =>
          s.id === editingScent.id
            ? {
                ...s,
                name,
                description,
                category,
                intensity,
                notes,
                season,
                mood,
              }
            : s
        );
        setScents(updatedScents);
        enqueueSnackbar('Scent updated successfully', { variant: 'success' });
      } else {
        // TODO: Replace with actual API call
        const newScent: Scent = {
          id: String(Date.now()),
          name,
          description,
          category,
          intensity,
          notes,
          season,
          mood,
        };
        setScents([...scents, newScent]);
        enqueueSnackbar('Scent created successfully', { variant: 'success' });
      }
      handleCloseDialog();
    } catch (error) {
      enqueueSnackbar('Error saving scent', { variant: 'error' });
    }
  };

  const handleDeleteScent = async (scentId: string) => {
    try {
      // TODO: Replace with actual API call
      setScents(scents.filter(s => s.id !== scentId));
      enqueueSnackbar('Scent deleted successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Error deleting scent', { variant: 'error' });
    }
  };

  return (
    <PageLayout title="Scent Management">
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Scent Management</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            Add Scent
          </Button>
        </Box>

        <Grid container spacing={3}>
          {scents.map((scent) => (
            <Grid item xs={12} sm={6} md={4} key={scent.id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" component="div">
                      {scent.name}
                    </Typography>
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(scent)}
                        sx={{ mr: 1 }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteScent(scent.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>

                  <Typography color="textSecondary" paragraph>
                    {scent.description}
                  </Typography>

                  <Box mb={2}>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Category: {scent.category}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Intensity:
                      <Rating
                        value={scent.intensity}
                        readOnly
                        max={5}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Typography>
                  </Box>

                  <Box mb={2}>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Notes:
                    </Typography>
                    <Box display="flex" gap={0.5} flexWrap="wrap">
                      {scent.notes.map((note) => (
                        <Chip label={note} key={note} size="small" />
                      ))}
                    </Box>
                  </Box>

                  <Box mb={2}>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Seasons:
                    </Typography>
                    <Box display="flex" gap={0.5} flexWrap="wrap">
                      {scent.season.map((s) => (
                        <Chip label={s} key={s} size="small" color="primary" variant="outlined" />
                      ))}
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Moods:
                    </Typography>
                    <Box display="flex" gap={0.5} flexWrap="wrap">
                      {scent.mood.map((m) => (
                        <Chip label={m} key={m} size="small" color="secondary" variant="outlined" />
                      ))}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingScent ? 'Edit Scent' : 'Add Scent'}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Scent Name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ mb: 2 }}
            />
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
              >
                {SCENT_CATEGORIES.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ mb: 2 }}>
              <Typography gutterBottom>Intensity</Typography>
              <Slider
                value={intensity}
                onChange={(_, value) => setIntensity(value as number)}
                min={1}
                max={5}
                marks
                valueLabelDisplay="auto"
              />
            </Box>

            <Autocomplete
              multiple
              options={[]}
              freeSolo
              value={notes}
              onChange={(_, newValue) => setNotes(newValue)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip label={option} {...getTagProps({ index })} />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Notes"
                  placeholder="Add notes"
                  sx={{ mb: 2 }}
                />
              )}
            />

            <Autocomplete
              multiple
              options={SEASONS}
              value={season}
              onChange={(_, newValue) => setSeason(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Seasons"
                  placeholder="Select seasons"
                  sx={{ mb: 2 }}
                />
              )}
            />

            <Autocomplete
              multiple
              options={MOODS}
              value={mood}
              onChange={(_, newValue) => setMood(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Moods"
                  placeholder="Select moods"
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSaveScent} color="primary" variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </PageLayout>
  );
};

export default ScentsPage;
