import React from 'react';
import {
  Box,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface OrdersFilterProps {
  filters: {
    status: string;
    dateRange: string;
    searchQuery: string;
    page: number;
    perPage: number;
  };
  onFilterChange: (filters: any) => void;
  disableStatusFilter?: boolean;
}

const OrdersFilter: React.FC<OrdersFilterProps> = ({
  filters,
  onFilterChange,
  disableStatusFilter = false,
}) => {
  const handleChange = (field: string, value: any) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
      {!disableStatusFilter && (
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status}
            label="Status"
            onChange={(e) => handleChange('status', e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="processing">Processing</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
      )}

      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel>Date Range</InputLabel>
        <Select
          value={filters.dateRange}
          label="Date Range"
          onChange={(e) => handleChange('dateRange', e.target.value)}
        >
          <MenuItem value="today">Today</MenuItem>
          <MenuItem value="yesterday">Yesterday</MenuItem>
          <MenuItem value="last7days">Last 7 Days</MenuItem>
          <MenuItem value="last30days">Last 30 Days</MenuItem>
          <MenuItem value="custom">Custom Range</MenuItem>
        </Select>
      </FormControl>

      <TextField
        size="small"
        label="Search"
        value={filters.searchQuery}
        onChange={(e) => handleChange('searchQuery', e.target.value)}
        placeholder="Search orders..."
        sx={{ minWidth: 200 }}
      />
    </Box>
  );
};

export default OrdersFilter;
