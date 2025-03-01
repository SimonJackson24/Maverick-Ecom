import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Snackbar,
  Alert,
  Paper,
} from '@mui/material';

type SchemaType = 'Product' | 'Organization' | 'LocalBusiness' | 'BreadcrumbList' | 'FAQPage';

interface SchemaTemplate {
  type: SchemaType;
  fields: {
    [key: string]: {
      type: string;
      required: boolean;
      description: string;
    };
  };
}

const schemaTemplates: { [key in SchemaType]: SchemaTemplate } = {
  Product: {
    type: 'Product',
    fields: {
      name: { type: 'string', required: true, description: 'Product name' },
      description: { type: 'string', required: true, description: 'Product description' },
      price: { type: 'number', required: true, description: 'Product price' },
      currency: { type: 'string', required: true, description: 'Currency code (e.g., GBP)' },
      sku: { type: 'string', required: true, description: 'Stock keeping unit' },
      brand: { type: 'string', required: false, description: 'Brand name' },
      image: { type: 'string', required: false, description: 'Product image URL' },
    },
  },
  Organization: {
    type: 'Organization',
    fields: {
      name: { type: 'string', required: true, description: 'Organization name' },
      url: { type: 'string', required: true, description: 'Organization website' },
      logo: { type: 'string', required: false, description: 'Organization logo URL' },
      description: { type: 'string', required: false, description: 'Organization description' },
    },
  },
  LocalBusiness: {
    type: 'LocalBusiness',
    fields: {
      name: { type: 'string', required: true, description: 'Business name' },
      address: { type: 'string', required: true, description: 'Physical address' },
      telephone: { type: 'string', required: true, description: 'Contact phone number' },
      openingHours: { type: 'string', required: false, description: 'Business hours' },
      priceRange: { type: 'string', required: false, description: 'Price range (e.g., £££)' },
    },
  },
  BreadcrumbList: {
    type: 'BreadcrumbList',
    fields: {
      items: { type: 'array', required: true, description: 'List of breadcrumb items (comma-separated)' },
    },
  },
  FAQPage: {
    type: 'FAQPage',
    fields: {
      questions: { type: 'array', required: true, description: 'Questions (comma-separated)' },
      answers: { type: 'array', required: true, description: 'Answers (comma-separated)' },
    },
  },
};

export const SchemaGenerator: React.FC = () => {
  const [schemaType, setSchemaType] = useState<SchemaType>('Product');
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [generatedSchema, setGeneratedSchema] = useState<string>('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as const });

  const handleTypeChange = (event: any) => {
    setSchemaType(event.target.value);
    setFormData({});
    setGeneratedSchema('');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateSchema = () => {
    const template = schemaTemplates[schemaType];
    const missingRequired = Object.entries(template.fields)
      .filter(([_, field]) => field.required && !formData[_])
      .map(([field]) => field);

    if (missingRequired.length > 0) {
      setSnackbar({
        open: true,
        message: `Missing required fields: ${missingRequired.join(', ')}`,
        severity: 'error',
      });
      return;
    }

    let schema: any = {
      '@context': 'https://schema.org',
      '@type': schemaType,
    };

    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        if (template.fields[key].type === 'array') {
          schema[key] = value.split(',').map((item) => item.trim());
        } else if (template.fields[key].type === 'number') {
          schema[key] = Number(value);
        } else {
          schema[key] = value;
        }
      }
    });

    // Special handling for specific schema types
    if (schemaType === 'BreadcrumbList') {
      schema.itemListElement = schema.items.map((item: string, index: number) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': item,
        'item': `${window.location.origin}/${item.toLowerCase().replace(/\s+/g, '-')}`,
      }));
      delete schema.items;
    } else if (schemaType === 'FAQPage') {
      schema.mainEntity = schema.questions.map((question: string, index: number) => ({
        '@type': 'Question',
        'name': question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': schema.answers[index],
        },
      }));
      delete schema.questions;
      delete schema.answers;
    }

    setGeneratedSchema(JSON.stringify(schema, null, 2));
    setSnackbar({
      open: true,
      message: 'Schema generated successfully!',
      severity: 'success',
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedSchema);
    setSnackbar({
      open: true,
      message: 'Schema copied to clipboard!',
      severity: 'success',
    });
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Schema Generator
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Schema Type</InputLabel>
                <Select value={schemaType} onChange={handleTypeChange} label="Schema Type">
                  {Object.keys(schemaTemplates).map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ mb: 3 }}>
              {Object.entries(schemaTemplates[schemaType].fields).map(([field, config]) => (
                <TextField
                  key={field}
                  fullWidth
                  label={`${field}${config.required ? ' *' : ''}`}
                  helperText={config.description}
                  value={formData[field] || ''}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  sx={{ mb: 2 }}
                  multiline={config.type === 'array'}
                  rows={config.type === 'array' ? 3 : 1}
                />
              ))}
            </Box>

            <Button
              variant="contained"
              color="primary"
              onClick={generateSchema}
              sx={{ mr: 1 }}
            >
              Generate Schema
            </Button>
          </Grid>

          <Grid item xs={12} md={6}>
            {generatedSchema && (
              <Paper sx={{ p: 2, bgcolor: '#282a36' }}>
                <Box sx={{ mb: 2 }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={copyToClipboard}
                    size="small"
                  >
                    Copy to Clipboard
                  </Button>
                </Box>
                <Box
                  component="pre"
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    bgcolor: 'background.paper',
                    overflow: 'auto',
                    '& code': {
                      display: 'block',
                      fontFamily: 'monospace',
                      fontSize: '0.875rem',
                      color: '#f8f8f2',
                    },
                  }}
                >
                  <code>{generatedSchema}</code>
                </Box>
              </Paper>
            )}
          </Grid>
        </Grid>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
};
