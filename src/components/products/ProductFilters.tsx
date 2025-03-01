import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
  Typography,
  Slider,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface ProductFiltersProps {
  filters: {
    categories: string[];
    scentProfiles: string[];
    priceRange: [number, number];
    inStock: boolean;
  };
  onFilterChange: (filters: any) => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  const categories = [
    { value: 'candles', label: 'Candles' },
    { value: 'bath-bombs', label: 'Bath Bombs' },
    { value: 'wax-melts', label: 'Wax Melts' },
    { value: 'soaps', label: 'Soaps' },
  ];

  const scentProfiles = [
    { value: 'recyclable', label: 'Recyclable Packaging' },
    { value: 'biodegradable', label: 'Biodegradable' },
    { value: 'organic', label: 'Organic Ingredients' },
    { value: 'vegan', label: 'Vegan' },
  ];

  const priceRange = [0, 100];

  const inStock = true;

  const [selectedFilters, setSelectedFilters] = React.useState({
    categories: [],
    scentProfiles: [],
    priceRange: priceRange,
    inStock: inStock,
  });

  const handleFilterChange = (filterId, value) => {
    setSelectedFilters((prevFilters) => {
      if (filterId === 'priceRange') {
        return { ...prevFilters, priceRange: value };
      } else if (filterId === 'inStock') {
        return { ...prevFilters, inStock: value };
      } else {
        const newFilters = prevFilters[filterId].includes(value)
          ? prevFilters[filterId].filter((filter) => filter !== value)
          : [...prevFilters[filterId], value];
        return { ...prevFilters, [filterId]: newFilters };
      }
    });
    onFilterChange(selectedFilters);
  };

  return (
    <Box>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Categories</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {categories.map((category) => (
            <FormControlLabel
              key={category.value}
              control={
                <Checkbox
                  checked={selectedFilters.categories.includes(category.value)}
                  onChange={() => handleFilterChange('categories', category.value)}
                />
              }
              label={category.label}
            />
          ))}
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Scent Profiles</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {scentProfiles.map((scentProfile) => (
            <FormControlLabel
              key={scentProfile.value}
              control={
                <Checkbox
                  checked={selectedFilters.scentProfiles.includes(scentProfile.value)}
                  onChange={() => handleFilterChange('scentProfiles', scentProfile.value)}
                />
              }
              label={scentProfile.label}
            />
          ))}
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Price Range</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Slider
            value={selectedFilters.priceRange}
            onChange={(event, newValue) => handleFilterChange('priceRange', newValue)}
            valueLabelDisplay="auto"
            min={priceRange[0]}
            max={priceRange[1]}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>In Stock</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedFilters.inStock}
                onChange={() => handleFilterChange('inStock', !selectedFilters.inStock)}
              />
            }
            label="In Stock"
          />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
