import React from 'react';
import {
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Autocomplete,
  Chip,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import { ScentProfile } from '../../types/Product';

interface ScentProfileFieldsProps {
  scentProfile: ScentProfile;
  onChange: (profile: ScentProfile) => void;
}

const SEASONS = ['Spring', 'Summer', 'Fall', 'Winter'];
const MOODS = [
  'Relaxing',
  'Energizing',
  'Romantic',
  'Fresh',
  'Cozy',
  'Calming',
  'Uplifting',
  'Sensual',
  'Festive',
  'Tropical',
];

const SCENT_CATEGORIES = [
  'Floral',
  'Woody',
  'Citrus',
  'Oriental',
  'Fresh',
  'Gourmand',
  'Herbal',
  'Spicy',
  'Fruity',
  'Aquatic',
];

const ScentProfileFields: React.FC<ScentProfileFieldsProps> = ({
  scentProfile,
  onChange,
}) => {
  const handleChange = (field: keyof ScentProfile, value: any) => {
    onChange({
      ...scentProfile,
      [field]: value,
    });
  };

  const handleNotesChange = (
    type: 'primaryNotes' | 'middleNotes' | 'baseNotes',
    value: string[]
  ) => {
    onChange({
      ...scentProfile,
      [type]: value,
    });
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Scent Profile
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={scentProfile.category || ''}
                onChange={(e) => handleChange('category', e.target.value)}
                label="Category"
              >
                {SCENT_CATEGORIES.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Typography gutterBottom>Intensity</Typography>
            <Slider
              value={scentProfile.intensity}
              onChange={(_, value) => handleChange('intensity', value)}
              min={1}
              max={10}
              step={1}
              marks
              valueLabelDisplay="auto"
            />
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              multiple
              options={[]}
              freeSolo
              value={scentProfile.primaryNotes}
              onChange={(_, value) => handleNotesChange('primaryNotes', value)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option}
                    {...getTagProps({ index })}
                    size="small"
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Top Notes"
                  helperText="The first impression of the scent"
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              multiple
              options={[]}
              freeSolo
              value={scentProfile.middleNotes}
              onChange={(_, value) => handleNotesChange('middleNotes', value)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option}
                    {...getTagProps({ index })}
                    size="small"
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Middle Notes"
                  helperText="The heart of the fragrance"
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              multiple
              options={[]}
              freeSolo
              value={scentProfile.baseNotes}
              onChange={(_, value) => handleNotesChange('baseNotes', value)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option}
                    {...getTagProps({ index })}
                    size="small"
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Base Notes"
                  helperText="The longest lasting notes"
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              multiple
              options={SEASONS}
              value={scentProfile.season || []}
              onChange={(_, value) => handleChange('season', value)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option}
                    {...getTagProps({ index })}
                    size="small"
                  />
                ))
              }
              renderInput={(params) => (
                <TextField {...params} label="Seasons" />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              multiple
              options={MOODS}
              value={scentProfile.mood || []}
              onChange={(_, value) => handleChange('mood', value)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option}
                    {...getTagProps({ index })}
                    size="small"
                  />
                ))
              }
              renderInput={(params) => (
                <TextField {...params} label="Moods" />
              )}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ScentProfileFields;
