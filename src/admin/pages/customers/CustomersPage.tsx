import React from 'react';
import {
  Box,
  Button,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Person, Email } from '@mui/icons-material';
import PageLayout from '../../components/layout/PageLayout';

const CustomersPage: React.FC = () => {
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'orders', headerName: 'Orders', width: 130 },
    { field: 'totalSpent', headerName: 'Total Spent', width: 130 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Person />}
            onClick={() => console.log('View customer', params.row.id)}
          >
            View
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Email />}
            onClick={() => console.log('Email customer', params.row.id)}
          >
            Email
          </Button>
        </Box>
      ),
    },
  ];

  const rows = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      orders: 5,
      totalSpent: '$500.00',
    },
    // Add more rows as needed
  ];

  return (
    <PageLayout title="Customers">
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

export default CustomersPage;
