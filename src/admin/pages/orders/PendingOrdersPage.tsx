import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Box, Typography, Button } from '@mui/material';
import { Permission } from '../../types';
import { GET_ORDERS } from '../../graphql/orders';
import OrdersTable from './components/OrdersTable';
import OrdersFilter from './components/OrdersFilter';
import OrderStats from './components/OrderStats';

interface PendingOrdersPageProps {}

const PendingOrdersPage: React.FC<PendingOrdersPageProps> = () => {
  const [filters, setFilters] = useState({
    status: 'pending',
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
    setFilters({ ...newFilters, status: 'pending' });
  };

  return (
    <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight="medium" color="text.primary">
          Pending Orders
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {/* Export functionality */}}
          >
            Export
          </Button>
        </Box>
      </Box>

      <OrderStats 
        data={data?.orderStats} 
        loading={loading}
        filterStatus="pending"
      />
      
      <OrdersFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        disableStatusFilter
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

export default PendingOrdersPage;
