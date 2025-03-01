import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { AdminUser } from '../../../../types/admin';
import { Permission } from '../../../types/permissions';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'Name', width: 130 },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'role', headerName: 'Role', width: 130 },
  {
    field: 'lastLogin',
    headerName: 'Last Login',
    width: 160,
    valueFormatter: (params) => {
      if (!params.value) return 'Never';
      return new Date(params.value).toLocaleString();
    },
  },
  {
    field: 'twoFactorEnabled',
    headerName: '2FA',
    width: 100,
    valueFormatter: (params) => (params.value ? 'Enabled' : 'Disabled'),
  },
];

interface UserListProps {
  users: AdminUser[];
  onEditUser: (user: AdminUser) => void;
  onDeleteUser: (userId: string) => void;
}

const UserList: React.FC<UserListProps> = ({ users, onEditUser, onDeleteUser }) => {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={users}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        checkboxSelection
        disableSelectionOnClick
      />
    </div>
  );
};

export default UserList;
