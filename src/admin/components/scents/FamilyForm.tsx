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
  FormControlLabel,
  Switch,
  Chip,
  Box,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ScentFamily, ScentNote } from '../../types/Scent';
import { ScentService } from '../../../services/ScentService';
import { useSnackbar } from 'notistack';

interface FamilyFormProps {
  open: boolean;
  onClose: () => void;
  family?: ScentFamily;
  notes: ScentNote[];
}

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required'),
  notes: Yup.array().min(1, 'At least one note is required'),
});

const FamilyForm: React.FC<FamilyFormProps> = ({ open, onClose, family, notes }) => {
  const { enqueueSnackbar } = useSnackbar();
  const scentService = ScentService.getInstance();

  const formik = useFormik({
    initialValues: {
      name: family?.name || '',
      description: family?.description || '',
      notes: family?.notes || [],
      isActive: family?.isActive ?? true,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (family) {
          await scentService.updateFamily(family.id, values);
          enqueueSnackbar('Family updated successfully', { variant: 'success' });
        } else {
          await scentService.createFamily(values);
          enqueueSnackbar('Family created successfully', { variant: 'success' });
        }
        onClose();
      } catch (error) {
        enqueueSnackbar('Error saving family', { variant: 'error' });
      }
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>{family ? 'Edit Family' : 'New Family'}</DialogTitle>
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
                    return note ? (
                      <Chip key={noteId} label={note.name} />
                    ) : null;
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
            {family ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default FamilyForm;
