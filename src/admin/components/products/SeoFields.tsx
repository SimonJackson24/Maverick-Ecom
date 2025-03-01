import React from 'react';
import {
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Autocomplete,
  Chip,
} from '@mui/material';
import { ProductSeo } from '../../types/Product';

interface SeoFieldsProps {
  seo: ProductSeo;
  onChange: (seo: ProductSeo) => void;
}

const SeoFields: React.FC<SeoFieldsProps> = ({ seo, onChange }) => {
  const handleChange = (field: keyof ProductSeo, value: string | string[]) => {
    onChange({
      ...seo,
      [field]: value,
    });
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Search Engine Optimization
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Meta Title"
              value={seo.title}
              onChange={(e) => handleChange('title', e.target.value)}
              helperText="Recommended length: 50-60 characters"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Meta Description"
              value={seo.description}
              onChange={(e) => handleChange('description', e.target.value)}
              multiline
              rows={3}
              helperText="Recommended length: 150-160 characters"
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              value={seo.keywords}
              onChange={(_, newValue) => handleChange('keywords', newValue)}
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
                  label="Meta Keywords"
                  helperText="Press Enter to add keywords"
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Canonical URL"
              value={seo.canonicalUrl || ''}
              onChange={(e) => handleChange('canonicalUrl', e.target.value)}
              helperText="Leave empty to use the default URL"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Open Graph Image URL"
              value={seo.ogImage || ''}
              onChange={(e) => handleChange('ogImage', e.target.value)}
              helperText="Image URL for social media sharing"
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default SeoFields;
