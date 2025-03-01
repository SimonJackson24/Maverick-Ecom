import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Box,
} from '@mui/material';
import { AdminUser } from '../../../../types/admin';
import { Permission } from '../../../types/permissions';

interface UserFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (user: Partial<AdminUser>) => void;
  user?: AdminUser;
}

const UserForm: React.FC<UserFormProps> = ({ open, onClose, onSave, user }) => {
  const [formData, setFormData] = React.useState<Partial<AdminUser>>(
    user || {
      name: '',
      email: '',
      role: 'manager',
      permissions: [],
      twoFactorEnabled: false,
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (e: any) => {
    const role = e.target.value;
    let permissions: Permission[] = [];

    // Set default permissions based on role
    switch (role) {
      case 'admin':
        permissions = Object.values(Permission);
        break;
      case 'manager':
        permissions = [
          Permission.VIEW_PRODUCTS,
          Permission.MANAGE_PRODUCTS,
          Permission.VIEW_ORDERS,
          Permission.MANAGE_ORDERS,
          Permission.VIEW_ANALYTICS,
        ];
        break;
      case 'support':
        permissions = [
          Permission.VIEW_CUSTOMER_DATA,
          Permission.MANAGE_CUSTOMER_SUPPORT,
        ];
        break;
    }

    setFormData((prev) => ({ ...prev, role, permissions }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{user ? 'Edit User' : 'Add New User'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              name="name"
              label="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <TextField
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <FormControl>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                onChange={handleRoleChange}
                label="Role"
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="support">Support</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.twoFactorEnabled}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      twoFactorEnabled: e.target.checked,
                    }))
                  }
                />
              }
              label="Require Two-Factor Authentication"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserForm;
