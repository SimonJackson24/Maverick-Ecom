import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import AdminLayout from '../../components/layout/AdminLayout';
import { SecurityService } from '../../services/SecurityService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Permission } from '../../types/permissions';

interface Device {
  id: string;
  deviceName: string;
  lastActive: string;
  browser: string;
  os: string;
  location: string;
  isCurrent: boolean;
}

const DeviceManagementPage: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const deviceList = await SecurityService.getDevices();
      setDevices(deviceList);
    } catch (err) {
      setError('Failed to fetch devices');
      console.error('Error fetching devices:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeAccess = async (deviceId: string) => {
    try {
      const result = await SecurityService.revokeDevice(deviceId);
      if (result.success) {
        setDevices(prevDevices => prevDevices.filter(device => device.id !== deviceId));
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to revoke device access');
      console.error('Error revoking device access:', err);
    }
  };

  if (loading) {
    return (
      <AdminLayout requirePermissions={[Permission.MANAGE_SECURITY]}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <LoadingSpinner />
        </Box>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout requirePermissions={[Permission.MANAGE_SECURITY]}>
        <Box p={3}>
          <Typography color="error">{error}</Typography>
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout requirePermissions={[Permission.MANAGE_SECURITY]}>
      <Box p={3}>
        <Typography variant="h4" gutterBottom>
          Device Management
        </Typography>
        <Typography variant="body1" paragraph>
          View and manage devices that have access to your admin account.
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Device</TableCell>
                <TableCell>Last Active</TableCell>
                <TableCell>Browser</TableCell>
                <TableCell>OS</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {devices.map((device) => (
                <TableRow key={device.id}>
                  <TableCell>{device.deviceName}</TableCell>
                  <TableCell>{new Date(device.lastActive).toLocaleString()}</TableCell>
                  <TableCell>{device.browser}</TableCell>
                  <TableCell>{device.os}</TableCell>
                  <TableCell>{device.location}</TableCell>
                  <TableCell>
                    {!device.isCurrent && (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleRevokeAccess(device.id)}
                      >
                        Revoke Access
                      </Button>
                    )}
                    {device.isCurrent && (
                      <Typography variant="body2" color="textSecondary">
                        Current Device
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </AdminLayout>
  );
};

export default DeviceManagementPage;
