import React from 'react';
import {
  Box,
  TextField,
  Typography,
  Chip,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';

interface ProductSeo {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl?: string;
  metaRobots?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  structuredData?: string;
}

interface Props {
  seo: ProductSeo;
  onChange: (seo: ProductSeo) => void;
}

const EnhancedSeoFields: React.FC<Props> = ({ seo, onChange }) => {
  const handleChange = (field: keyof ProductSeo, value: any) => {
    onChange({
      ...seo,
      [field]: value,
    });
  };

  const handleKeywordsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const keywords = event.target.value.split(',').map(k => k.trim());
    handleChange('keywords', keywords);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Basic SEO
          </Typography>
          <TextField
            fullWidth
            label="Meta Title"
            value={seo.title}
            onChange={(e) => handleChange('title', e.target.value)}
            helperText={`${seo.title.length}/60 characters - Optimal length: 50-60`}
            error={seo.title.length > 60}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Meta Description"
            value={seo.description}
            onChange={(e) => handleChange('description', e.target.value)}
            helperText={`${seo.description.length}/160 characters - Optimal length: 150-160`}
            error={seo.description.length > 160}
            margin="normal"
            multiline
            rows={3}
          />
          <TextField
            fullWidth
            label="Keywords (comma-separated)"
            value={seo.keywords.join(', ')}
            onChange={handleKeywordsChange}
            helperText="Enter keywords separated by commas"
            margin="normal"
          />
          <TextField
            fullWidth
            label="Canonical URL"
            value={seo.canonicalUrl || ''}
            onChange={(e) => handleChange('canonicalUrl', e.target.value)}
            helperText="Set this if the product appears on multiple URLs"
            margin="normal"
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Social Media Optimization
          </Typography>
          <TextField
            fullWidth
            label="Open Graph Title"
            value={seo.ogTitle || ''}
            onChange={(e) => handleChange('ogTitle', e.target.value)}
            helperText="Custom title for social media sharing"
            margin="normal"
          />
          <TextField
            fullWidth
            label="Open Graph Description"
            value={seo.ogDescription || ''}
            onChange={(e) => handleChange('ogDescription', e.target.value)}
            helperText="Custom description for social media sharing"
            margin="normal"
            multiline
            rows={2}
          />
          <TextField
            fullWidth
            label="Open Graph Image URL"
            value={seo.ogImage || ''}
            onChange={(e) => handleChange('ogImage', e.target.value)}
            helperText="Custom image URL for social media sharing"
            margin="normal"
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Advanced SEO
          </Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel>Meta Robots</InputLabel>
            <Select
              value={seo.metaRobots || 'index,follow'}
              onChange={(e) => handleChange('metaRobots', e.target.value)}
              label="Meta Robots"
            >
              <MenuItem value="index,follow">Index, Follow</MenuItem>
              <MenuItem value="noindex,follow">No Index, Follow</MenuItem>
              <MenuItem value="index,nofollow">Index, No Follow</MenuItem>
              <MenuItem value="noindex,nofollow">No Index, No Follow</MenuItem>
            </Select>
            <FormHelperText>Control how search engines handle this product</FormHelperText>
          </FormControl>
          <TextField
            fullWidth
            label="Structured Data (JSON-LD)"
            value={seo.structuredData || ''}
            onChange={(e) => handleChange('structuredData', e.target.value)}
            helperText="JSON-LD structured data for rich snippets"
            margin="normal"
            multiline
            rows={4}
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Current Keywords:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {seo.keywords.map((keyword, index) => (
                <Chip
                  key={index}
                  label={keyword}
                  onDelete={() => {
                    const newKeywords = [...seo.keywords];
                    newKeywords.splice(index, 1);
                    handleChange('keywords', newKeywords);
                  }}
                />
              ))}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EnhancedSeoFields;
