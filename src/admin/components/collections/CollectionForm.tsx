import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Box,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Collection, CollectionFormData } from '../../types/Collection';
import { CollectionService } from '../../../services/CollectionService';
import { useSnackbar } from 'notistack';
import SingleImageUpload from '../common/SingleImageUpload';
import ProductSelector from '../products/ProductSelector';

interface CollectionFormProps {
  open: boolean;
  onClose: () => void;
  collection?: Collection;
}

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required'),
  slug: Yup.string().required('Slug is required'),
  seo: Yup.object({
    title: Yup.string().required('SEO title is required'),
    description: Yup.string().required('SEO description is required'),
    keywords: Yup.array().of(Yup.string()),
  }),
});

const CollectionForm: React.FC<CollectionFormProps> = ({
  open,
  onClose,
  collection,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const collectionService = CollectionService.getInstance();

  const formik = useFormik<CollectionFormData>({
    initialValues: {
      name: collection?.name || '',
      description: collection?.description || '',
      slug: collection?.slug || '',
      imageUrl: collection?.imageUrl || '',
      products: collection?.products || [],
      isActive: collection?.isActive ?? true,
      position: collection?.position || 0,
      seo: {
        title: collection?.seo.title || '',
        description: collection?.seo.description || '',
        keywords: collection?.seo.keywords || [],
      },
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (collection) {
          await collectionService.updateCollection(collection.id, values);
          enqueueSnackbar('Collection updated successfully', { variant: 'success' });
        } else {
          await collectionService.createCollection(values);
          enqueueSnackbar('Collection created successfully', { variant: 'success' });
        }
        onClose();
      } catch (error) {
        enqueueSnackbar('Error saving collection', { variant: 'error' });
      }
    },
  });

  const handleImageUpload = (url: string) => {
    formik.setFieldValue('imageUrl', url);
  };

  const handleProductsChange = (productIds: string[]) => {
    formik.setFieldValue('products', productIds);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>{collection ? 'Edit Collection' : 'New Collection'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
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

            <TextField
              fullWidth
              margin="normal"
              name="slug"
              label="Slug"
              value={formik.values.slug}
              onChange={formik.handleChange}
              error={formik.touched.slug && Boolean(formik.errors.slug)}
              helperText={formik.touched.slug && formik.errors.slug}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <SingleImageUpload
              currentImage={formik.values.imageUrl}
              onImageUpload={handleImageUpload}
              label="Collection Image"
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <ProductSelector
              selectedProducts={formik.values.products}
              onChange={handleProductsChange}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              margin="normal"
              name="seo.title"
              label="SEO Title"
              value={formik.values.seo.title}
              onChange={formik.handleChange}
              error={formik.touched.seo?.title && Boolean(formik.errors.seo?.title)}
              helperText={formik.touched.seo?.title && formik.errors.seo?.title}
            />

            <TextField
              fullWidth
              margin="normal"
              name="seo.description"
              label="SEO Description"
              multiline
              rows={2}
              value={formik.values.seo.description}
              onChange={formik.handleChange}
              error={formik.touched.seo?.description && Boolean(formik.errors.seo?.description)}
              helperText={formik.touched.seo?.description && formik.errors.seo?.description}
            />

            <TextField
              fullWidth
              margin="normal"
              name="seo.keywords"
              label="SEO Keywords"
              placeholder="Enter keywords separated by commas"
              value={formik.values.seo.keywords.join(', ')}
              onChange={(e) => {
                const keywords = e.target.value.split(',').map((k) => k.trim());
                formik.setFieldValue('seo.keywords', keywords);
              }}
            />
          </Box>

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
            {collection ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CollectionForm;
