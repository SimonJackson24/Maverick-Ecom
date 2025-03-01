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
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ScentNote, ScentNoteCategory } from '../../types/Scent';
import { ScentService } from '../../../services/ScentService';
import { useSnackbar } from 'notistack';

interface NoteFormProps {
  open: boolean;
  onClose: () => void;
  note?: ScentNote;
}

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required'),
  category: Yup.string().required('Category is required'),
  intensity: Yup.number().min(1).max(10).required('Intensity is required'),
});

const NoteForm: React.FC<NoteFormProps> = ({ open, onClose, note }) => {
  const { enqueueSnackbar } = useSnackbar();
  const scentService = ScentService.getInstance();

  const formik = useFormik({
    initialValues: {
      name: note?.name || '',
      description: note?.description || '',
      category: note?.category || ScentNoteCategory.TOP,
      intensity: note?.intensity || 5,
      isActive: note?.isActive ?? true,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (note) {
          await scentService.updateNote(note.id, values);
          enqueueSnackbar('Note updated successfully', { variant: 'success' });
        } else {
          await scentService.createNote(values);
          enqueueSnackbar('Note created successfully', { variant: 'success' });
        }
        onClose();
      } catch (error) {
        enqueueSnackbar('Error saving note', { variant: 'error' });
      }
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>{note ? 'Edit Note' : 'New Note'}</DialogTitle>
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
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={formik.values.category}
              onChange={formik.handleChange}
              error={formik.touched.category && Boolean(formik.errors.category)}
            >
              {Object.values(ScentNoteCategory).map((category) => (
                <MenuItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
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
            {note ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default NoteForm;
