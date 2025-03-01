import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  FormControlLabel,
  Switch,
  Chip,
  Box,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ScentCombination, ScentNote, Season, Mood } from '../../types/Scent';
import { ScentService } from '../../../services/ScentService';
import { useSnackbar } from 'notistack';

interface CombinationFormProps {
  open: boolean;
  onClose: () => void;
  combination?: ScentCombination;
  notes: ScentNote[];
}

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required'),
  notes: Yup.array().min(1, 'At least one note is required'),
  intensity: Yup.number().min(1).max(10).required('Intensity is required'),
  seasons: Yup.array().min(1, 'At least one season is required'),
  moods: Yup.array().min(1, 'At least one mood is required'),
});

const CombinationForm: React.FC<CombinationFormProps> = ({
  open,
  onClose,
  combination,
  notes,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const scentService = ScentService.getInstance();

  const formik = useFormik({
    initialValues: {
      name: combination?.name || '',
      description: combination?.description || '',
      notes: combination?.notes || [],
      intensity: combination?.intensity || 5,
      seasons: combination?.seasons || [],
      moods: combination?.moods || [],
      isActive: combination?.isActive ?? true,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (combination) {
          await scentService.updateCombination(combination.id, values);
          enqueueSnackbar('Combination updated successfully', { variant: 'success' });
        } else {
          await scentService.createCombination(values);
          enqueueSnackbar('Combination created successfully', { variant: 'success' });
        }
        onClose();
      } catch (error) {
        enqueueSnackbar('Error saving combination', { variant: 'error' });
      }
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>
          {combination ? 'Edit Combination' : 'New Combination'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            name="name"
            label="Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />

          <TextField
            fullWidth
            margin="normal"
            name="description"
            label="Description"
            multiline
            rows={3}
            value={formik.values.description}
            onChange={formik.handleChange}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Notes</InputLabel>
            <Select
              multiple
              name="notes"
              value={formik.values.notes}
              onChange={formik.handleChange}
              error={formik.touched.notes && Boolean(formik.errors.notes)}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((noteId) => {
                    const note = notes.find((n) => n.id === noteId);
                    return note ? <Chip key={noteId} label={note.name} /> : null;
                  })}
                </Box>
              )}
            >
              {notes.map((note) => (
                <MenuItem key={note.id} value={note.id}>
                  {note.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Intensity (1-10)</InputLabel>
            <Slider
              name="intensity"
              value={formik.values.intensity}
              onChange={(_, value) => formik.setFieldValue('intensity', value)}
              min={1}
              max={10}
              step={1}
              marks
              valueLabelDisplay="auto"
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Seasons</InputLabel>
            <Select
              multiple
              name="seasons"
              value={formik.values.seasons}
              onChange={formik.handleChange}
              error={formik.touched.seasons && Boolean(formik.errors.seasons)}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((season) => (
                    <Chip key={season} label={season} />
                  ))}
                </Box>
              )}
            >
              {Object.values(Season).map((season) => (
                <MenuItem key={season} value={season}>
                  {season.charAt(0).toUpperCase() + season.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Moods</InputLabel>
            <Select
              multiple
              name="moods"
              value={formik.values.moods}
              onChange={formik.handleChange}
              error={formik.touched.moods && Boolean(formik.errors.moods)}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((mood) => (
                    <Chip key={mood} label={mood} />
                  ))}
                </Box>
              )}
            >
              {Object.values(Mood).map((mood) => (
                <MenuItem key={mood} value={mood}>
                  {mood.charAt(0).toUpperCase() + mood.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Switch
                name="isActive"
                checked={formik.values.isActive}
                onChange={formik.handleChange}
              />
            }
            label="Active"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {combination ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CombinationForm;
