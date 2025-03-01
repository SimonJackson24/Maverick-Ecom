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
import { ScentProfile, ScentNote, Season, Mood, ScentNoteCategory } from '../../types/Scent';
import { ScentService } from '../../../services/ScentService';
import { useSnackbar } from 'notistack';

interface ProfileFormProps {
  open: boolean;
  onClose: () => void;
  profile?: ScentProfile;
  notes: ScentNote[];
}

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required'),
  notes: Yup.object({
    top: Yup.array().min(1, 'At least one top note is required'),
    middle: Yup.array().min(1, 'At least one middle note is required'),
    base: Yup.array().min(1, 'At least one base note is required'),
  }),
  intensity: Yup.number().min(1).max(10).required('Intensity is required'),
  seasons: Yup.array().min(1, 'At least one season is required'),
  moods: Yup.array().min(1, 'At least one mood is required'),
});

const ProfileForm: React.FC<ProfileFormProps> = ({
  open,
  onClose,
  profile,
  notes,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const scentService = ScentService.getInstance();

  const formik = useFormik({
    initialValues: {
      name: profile?.name || '',
      description: profile?.description || '',
      notes: {
        top: profile?.notes.top || [],
        middle: profile?.notes.middle || [],
        base: profile?.notes.base || [],
      },
      intensity: profile?.intensity || 5,
      seasons: profile?.seasons || [],
      moods: profile?.moods || [],
      isActive: profile?.isActive ?? true,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (profile) {
          await scentService.updateProfile(profile.id, values);
          enqueueSnackbar('Profile updated successfully', { variant: 'success' });
        } else {
          await scentService.createProfile(values);
          enqueueSnackbar('Profile created successfully', { variant: 'success' });
        }
        onClose();
      } catch (error) {
        enqueueSnackbar('Error saving profile', { variant: 'error' });
      }
    },
  });

  const getNotesByCategory = (category: ScentNoteCategory) => {
    return notes.filter((note) => note.category === category);
  };

  const renderNoteSelect = (category: 'top' | 'middle' | 'base', label: string) => (
    <FormControl fullWidth margin="normal">
      <InputLabel>{label}</InputLabel>
      <Select
        multiple
        name={`notes.${category}`}
        value={formik.values.notes[category]}
        onChange={formik.handleChange}
        error={
          formik.touched.notes?.[category] &&
          Boolean(formik.errors.notes?.[category])
        }
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((noteId) => {
              const note = notes.find((n) => n.id === noteId);
              return note ? <Chip key={noteId} label={note.name} /> : null;
            })}
          </Box>
        )}
      >
        {getNotesByCategory(category.toUpperCase() as ScentNoteCategory).map((note) => (
          <MenuItem key={note.id} value={note.id}>
            {note.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>{profile ? 'Edit Profile' : 'New Profile'}</DialogTitle>
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

          {renderNoteSelect('top', 'Top Notes')}
          {renderNoteSelect('middle', 'Middle Notes')}
          {renderNoteSelect('base', 'Base Notes')}

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
            {profile ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProfileForm;
