import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Box, Typography, Button, Link } from '@mui/material';
import { LocalShipping } from '@mui/icons-material';
import { Permission } from '../../types';
import { GET_ORDERS } from '../../graphql/orders';
import OrdersTable from './components/OrdersTable';
import OrdersFilter from './components/OrdersFilter';
import OrderStats from './components/OrderStats';

interface OrdersDashboardProps {}

const OrdersDashboard: React.FC<OrdersDashboardProps> = () => {
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'today',
    searchQuery: '',
    page: 1,
    perPage: 20
  });

  const { data, loading, error } = useQuery(GET_ORDERS, {
    variables: filters,
    fetchPolicy: 'network-only'
  });

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  return (
    <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="medium" color="text.primary">
          Orders
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<LocalShipping />}
            component={Link}
            to="/admin/orders/bulk-labels"
          >
            Bulk Label Generation
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {/* Export functionality */}}
          >
            Export
          </Button>
        </Box>
      </Box>

      <OrderStats data={data?.orderStats} loading={loading} />
      
      <OrdersFilter
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      <OrdersTable
        orders={data?.orders?.items || []}
        loading={loading}
        error={error}
        filters={filters}
        onFilterChange={handleFilterChange}
      />
    </Box>
  );
};

export default OrdersDashboard;
