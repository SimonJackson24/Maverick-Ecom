import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Tabs,
  Tab,
  FormControlLabel,
  FormControl,
  Switch,
  Divider,
  Alert,
  CircularProgress,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import { Product, ProductImage, ProductSeo, ScentProfile } from '../../types/Product';
import MediaUpload from '../../components/products/MediaUpload';
import EnhancedSeoFields from '../../components/products/EnhancedSeoFields';
import ScentProfileFields from '../../components/products/ScentProfileFields';
import CollectionSelector from '../../components/collections/CollectionSelector';
import AdobeCommerceService from '../../../services/AdobeCommerceService';
import RequirePermission from '../../components/auth/RequirePermission';
import { useMutation } from '@apollo/client';
import { CREATE_PRODUCT_INVENTORY, UPDATE_PRODUCT_INVENTORY } from '../../graphql/inventory';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface Product {
  id: string;
  name: string;
  sku: string;
  slug: string;
  description: string;
  shortDescription: string;
  status: string;
  stockStatus: string;
  stockQuantity: number;
  lowStockThreshold: number;
  images: ProductImage[];
  scentProfile: ScentProfile;
  seo: {
    title: string;
    description: string;
    keywords: string[];
    canonicalUrl?: string;
    metaRobots?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    structuredData?: string;
  };
  dimensions: {
    weight: number;
    height: number;
    width: number;
    length: number;
  };
  categories: string[];
  tags: string[];
  collections: string[];
  price: {
    regularPrice: {
      amount: {
        value: number;
        currency: string;
      }
    }
  };
  hasVariants: boolean;
  backorderable: boolean;
  preorderable: boolean;
  featured: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  createdAt: string;
  updatedAt: string;
  metaData?: {
    ingredients?: string[];
    burnTime?: string;
    fragrance?: string;
    scentStrength?: 'light' | 'medium' | 'strong';
    sustainabilityInfo?: string;
    careInstructions?: string;
    warnings?: string[];
  };
}

const ProductForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<Product>({
    id: '',
    name: '',
    sku: '',
    slug: '',
    description: '',
    shortDescription: '',
    status: 'draft',
    stockStatus: 'in_stock',
    stockQuantity: 0,
    lowStockThreshold: 10,
    images: [],
    scentProfile: {
      notes: [],
      intensity: 'MEDIUM',
      season: [],
      mood: []
    },
    seo: {
      title: '',
      description: '',
      keywords: [],
      canonicalUrl: '',
      metaRobots: 'index,follow',
      ogTitle: '',
      ogDescription: '',
      ogImage: '',
      structuredData: ''
    },
    dimensions: {
      weight: 0,
      height: 0,
      width: 0,
      length: 0
    },
    categories: [],
    tags: [],
    collections: [],
    price: {
      regularPrice: {
        amount: {
          value: 0,
          currency: 'USD'
        }
      }
    },
    hasVariants: false,
    backorderable: false,
    preorderable: false,
    featured: false,
    newArrival: false,
    bestSeller: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metaData: {
      ingredients: [],
      burnTime: '',
      fragrance: '',
      scentStrength: 'medium',
      sustainabilityInfo: '',
      careInstructions: '',
      warnings: []
    }
  });

  // Apollo mutations for inventory
  const [createInventory] = useMutation(CREATE_PRODUCT_INVENTORY);
  const [updateInventory] = useMutation(UPDATE_PRODUCT_INVENTORY);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const response = await AdobeCommerceService.getInstance({
          baseUrl: import.meta.env.VITE_ADOBE_COMMERCE_URL || '',
          accessToken: import.meta.env.VITE_ADOBE_COMMERCE_ACCESS_TOKEN || '',
        }).getProduct(id);
        setProduct(response);
      } catch (err) {
        setError('Failed to load product');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleBasicInfoChange = (field: keyof Product, value: any) => {
    setProduct((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImagesChange = (images: ProductImage[]) => {
    setProduct((prev) => ({
      ...prev,
      images,
    }));
  };

  const handleSeoChange = (seo: ProductSeo) => {
    setProduct((prev) => ({
      ...prev,
      seo,
    }));
  };

  const handleScentProfileChange = (scentProfile: ScentProfile) => {
    setProduct((prev) => ({
      ...prev,
      scentProfile,
    }));
  };

  const handleScentStrengthChange = (event: SelectChangeEvent) => {
    handleBasicInfoChange('metaData', {
      ...product.metaData,
      scentStrength: event.target.value
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const productData = {
        ...product,
        generateSlug: !product.id // Only generate slug for new products
      };

      let savedProduct;
      if (id) {
        savedProduct = await AdobeCommerceService.getInstance({
          baseUrl: import.meta.env.VITE_ADOBE_COMMERCE_URL || '',
          accessToken: import.meta.env.VITE_ADOBE_COMMERCE_ACCESS_TOKEN || '',
        }).updateProduct(id, productData);

        // Update inventory
        await updateInventory({
          variables: {
            productId: id,
            input: {
              stockLevel: product.stockQuantity,
              lowStockThreshold: product.lowStockThreshold,
              sku: product.sku
            }
          }
        });
      } else {
        savedProduct = await AdobeCommerceService.getInstance({
          baseUrl: import.meta.env.VITE_ADOBE_COMMERCE_URL || '',
          accessToken: import.meta.env.VITE_ADOBE_COMMERCE_ACCESS_TOKEN || '',
        }).createProduct(productData);

        // Create inventory record
        await createInventory({
          variables: {
            input: {
              productId: savedProduct.id,
              stockLevel: product.stockQuantity,
              lowStockThreshold: product.lowStockThreshold,
              sku: product.sku
            }
          }
        });
      }

      navigate('/admin/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving the product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <RequirePermission permission="products.edit">
      <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Card>
          <CardContent>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs value={activeTab} onChange={handleTabChange} aria-label="product form tabs">
                <Tab label="Basic Information" />
                <Tab label="Images & Media" />
                <Tab label="SEO & Visibility" />
                <Tab label="Inventory" />
                <Tab label="Scent Profile" />
                <Tab label="Additional Details" />
              </Tabs>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <TabPanel value={activeTab} index={0}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Product Name"
                    value={product.name}
                    onChange={(e) => handleBasicInfoChange('name', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="SKU"
                    value={product.sku}
                    onChange={(e) => handleBasicInfoChange('sku', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Short Description"
                    value={product.shortDescription}
                    onChange={(e) => handleBasicInfoChange('shortDescription', e.target.value)}
                    multiline
                    rows={2}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Description"
                    value={product.description}
                    onChange={(e) => handleBasicInfoChange('description', e.target.value)}
                    multiline
                    rows={4}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Regular Price"
                    type="number"
                    value={product.price.regularPrice.amount.value}
                    onChange={(e) => handleBasicInfoChange('price', {
                      ...product.price,
                      regularPrice: {
                        amount: {
                          value: parseFloat(e.target.value),
                          currency: 'USD'
                        }
                      }
                    })}
                    required
                  />
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
              <MediaUpload images={product.images} onChange={handleImagesChange} />
            </TabPanel>

            <TabPanel value={activeTab} index={2}>
              <EnhancedSeoFields seo={product.seo} onChange={handleSeoChange} />
            </TabPanel>

            <TabPanel value={activeTab} index={3}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Stock Quantity"
                    type="number"
                    value={product.stockQuantity}
                    onChange={(e) => handleBasicInfoChange('stockQuantity', parseInt(e.target.value))}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Low Stock Threshold"
                    type="number"
                    value={product.lowStockThreshold}
                    onChange={(e) => handleBasicInfoChange('lowStockThreshold', parseInt(e.target.value))}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={product.backorderable}
                        onChange={(e) => handleBasicInfoChange('backorderable', e.target.checked)}
                      />
                    }
                    label="Allow Backorders"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={product.preorderable}
                        onChange={(e) => handleBasicInfoChange('preorderable', e.target.checked)}
                      />
                    }
                    label="Allow Pre-orders"
                  />
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value={activeTab} index={4}>
              <ScentProfileFields scentProfile={product.scentProfile} onChange={handleScentProfileChange} />
            </TabPanel>

            <TabPanel value={activeTab} index={5}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Ingredients"
                    value={product.metaData?.ingredients?.join(', ')}
                    onChange={(e) => handleBasicInfoChange('metaData', {
                      ...product.metaData,
                      ingredients: e.target.value.split(',').map(i => i.trim())
                    })}
                    helperText="Enter ingredients separated by commas"
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Burn Time"
                    value={product.metaData?.burnTime}
                    onChange={(e) => handleBasicInfoChange('metaData', {
                      ...product.metaData,
                      burnTime: e.target.value
                    })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Scent Strength</InputLabel>
                    <Select
                      value={product.metaData?.scentStrength || 'medium'}
                      onChange={handleScentStrengthChange}
                      label="Scent Strength"
                    >
                      <MenuItem value="light">Light</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="strong">Strong</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Sustainability Information"
                    value={product.metaData?.sustainabilityInfo}
                    onChange={(e) => handleBasicInfoChange('metaData', {
                      ...product.metaData,
                      sustainabilityInfo: e.target.value
                    })}
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Care Instructions"
                    value={product.metaData?.careInstructions}
                    onChange={(e) => handleBasicInfoChange('metaData', {
                      ...product.metaData,
                      careInstructions: e.target.value
                    })}
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Safety Warnings"
                    value={product.metaData?.warnings?.join('\n')}
                    onChange={(e) => handleBasicInfoChange('metaData', {
                      ...product.metaData,
                      warnings: e.target.value.split('\n').map(w => w.trim())
                    })}
                    multiline
                    rows={3}
                    helperText="Enter each warning on a new line"
                  />
                </Grid>
              </Grid>
            </TabPanel>
          </CardContent>
        </Card>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={() => navigate(-1)}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={saving}
            startIcon={saving ? <CircularProgress size={20} /> : null}
          >
            {saving ? 'Saving...' : id ? 'Update Product' : 'Create Product'}
          </Button>
        </Box>
      </Box>
    </RequirePermission>
  );
};

export default ProductForm;
