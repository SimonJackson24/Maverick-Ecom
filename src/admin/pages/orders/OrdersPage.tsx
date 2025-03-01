import React from 'react';
import {
  Box,
  Button,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { LocalShipping, Receipt } from '@mui/icons-material';
import PageLayout from '../../components/layout/PageLayout';

const OrdersPage: React.FC = () => {
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Order ID', width: 130 },
    { field: 'customer', headerName: 'Customer', width: 200 },
    { field: 'date', headerName: 'Date', width: 130 },
    { field: 'total', headerName: 'Total', width: 130 },
    { field: 'status', headerName: 'Status', width: 130 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Receipt />}
            onClick={() => console.log('View order', params.row.id)}
          >
            View
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<LocalShipping />}
            onClick={() => console.log('Ship order', params.row.id)}
          >
            Ship
          </Button>
        </Box>
      ),
    },
  ];

  const rows = [
    {
      id: 1,
      customer: 'John Doe',
      date: '2025-02-16',
      total: '$150.00',
      status: 'Processing',
    },
    // Add more rows as needed
  ];

  return (
    <PageLayout title="Orders">
      <div className="h-full">
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[10, 25, 50]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </div>
    </PageLayout>
  );
};

export default OrdersPage;
