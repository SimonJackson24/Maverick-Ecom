import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  SelectChangeEvent,
} from '@mui/material';
import AdobeCommerceService from '../../../services/AdobeCommerceService';

interface Product {
  id: string;
  name: string;
  sku: string;
}

interface ProductSelectorProps {
  selectedProducts: string[];
  onChange: (productIds: string[]) => void;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({
  selectedProducts,
  onChange,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const adobeCommerceService = AdobeCommerceService.getInstance({
    baseUrl: import.meta.env.VITE_ADOBE_COMMERCE_URL,
    accessToken: import.meta.env.VITE_ADOBE_COMMERCE_ACCESS_TOKEN
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await adobeCommerceService.get('/products');
      setProducts(response);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    onChange(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <FormControl fullWidth margin="normal">
      <InputLabel>Products</InputLabel>
      <Select
        multiple
        value={selectedProducts}
        onChange={handleChange}
        input={<OutlinedInput label="Products" />}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((productId) => {
              const product = products.find((p) => p.id === productId);
              return product ? (
                <Chip key={productId} label={product.name} />
              ) : null;
            })}
          </Box>
        )}
        disabled={loading}
      >
        {products.map((product) => (
          <MenuItem key={product.id} value={product.id}>
            {product.name} ({product.sku})
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ProductSelector;
