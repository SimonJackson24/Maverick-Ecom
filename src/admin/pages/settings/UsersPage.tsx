import React, { useState, useEffect } from 'react';
import { Button, Box, Typography, Alert } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import UserList from './users/UserList';
import UserForm from './users/UserForm';
import { AdminUser } from '../../../types/admin';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_ADMIN_USERS,
  CREATE_ADMIN_USER,
  UPDATE_ADMIN_USER,
  DELETE_ADMIN_USER,
} from '../../../graphql/admin';
import AdminLayout from '../../components/layout/AdminLayout';
import { Permission } from '../../types/permissions';

const UsersPage: React.FC = () => {
  const [openUserForm, setOpenUserForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | undefined>();
  const [error, setError] = useState<string | null>(null);

  const { data, loading, error: queryError } = useQuery(GET_ADMIN_USERS);
  const [createUser] = useMutation(CREATE_ADMIN_USER);
  const [updateUser] = useMutation(UPDATE_ADMIN_USER);
  const [deleteUser] = useMutation(DELETE_ADMIN_USER);

  const handleCreateUser = async (userData: Partial<AdminUser>) => {
    try {
      await createUser({ variables: { input: userData } });
      setOpenUserForm(false);
    } catch (err) {
      setError('Failed to create user. Please try again.');
    }
  };

  const handleUpdateUser = async (userData: Partial<AdminUser>) => {
    try {
      await updateUser({
        variables: { id: selectedUser?.id, input: userData },
      });
      setOpenUserForm(false);
      setSelectedUser(undefined);
    } catch (err) {
      setError('Failed to update user. Please try again.');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser({ variables: { id: userId } });
      } catch (err) {
        setError('Failed to delete user. Please try again.');
      }
    }
  };

  const handleEditUser = (user: AdminUser) => {
    setSelectedUser(user);
    setOpenUserForm(true);
  };

  return (
    <AdminLayout requiredPermissions={[Permission.MANAGE_USERS]}>
      <Box className="p-6">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" component="h1">
            User Management
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedUser(undefined);
              setOpenUserForm(true);
            }}
          >
            Add User
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {queryError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to load users. Please refresh the page.
          </Alert>
        )}

        {loading ? (
          <Typography>Loading users...</Typography>
        ) : (
          <UserList
            users={data?.adminUsers || []}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
          />
        )}

        <UserForm
          open={openUserForm}
          onClose={() => {
            setOpenUserForm(false);
            setSelectedUser(undefined);
          }}
          onSave={selectedUser ? handleUpdateUser : handleCreateUser}
          user={selectedUser}
        />
      </Box>
    </AdminLayout>
  );
};

export default UsersPage;
