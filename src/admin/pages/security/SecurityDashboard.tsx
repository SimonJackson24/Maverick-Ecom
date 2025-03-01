import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AdminLayout from '../../components/layout/AdminLayout';
import { SecurityService } from '../../services/SecurityService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Permission } from '../../types/permissions';

interface SecurityEvent {
  id: string;
  timestamp: string;
  eventType: string;
  status: string;
  ipAddress: string;
  location: string;
  deviceInfo: string;
}

const SecurityDashboard: React.FC = () => {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date>(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)); // 7 days ago
  const [endDate, setEndDate] = useState<Date>(new Date());

  useEffect(() => {
    fetchSecurityEvents();
  }, [startDate, endDate]);

  const fetchSecurityEvents = async () => {
    try {
      const filters = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      };
      const eventList = await SecurityService.getSecurityEvents(filters);
      setEvents(eventList);
    } catch (err: any) {
      setError('Failed to fetch security events');
      console.error('Error fetching security events:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string): "success" | "warning" | "error" | "default" => {
    switch (status.toLowerCase()) {
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <AdminLayout requiredPermissions={[Permission.MANAGE_SECURITY]}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <LoadingSpinner />
        </Box>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout requiredPermissions={[Permission.MANAGE_SECURITY]}>
        <Box p={3}>
          <Typography color="error">{error}</Typography>
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout requiredPermissions={[Permission.MANAGE_SECURITY]}>
      <Box p={3}>
        <Typography variant="h4" gutterBottom>
          Security Dashboard
        </Typography>
        <Typography variant="body1" paragraph>
          Monitor security events and activities across your admin account.
        </Typography>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box display="flex" gap={2} mb={3}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue: Date | null) => newValue && setStartDate(newValue)}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(newValue: Date | null) => newValue && setEndDate(newValue)}
            />
          </Box>
        </LocalizationProvider>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>Event Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>IP Address</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Device Info</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>{new Date(event.timestamp).toLocaleString()}</TableCell>
                  <TableCell>{event.eventType}</TableCell>
                  <TableCell>
                    <Chip
                      label={event.status}
                      color={getStatusColor(event.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{event.ipAddress}</TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>{event.deviceInfo}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </AdminLayout>
  );
};

export default SecurityDashboard;
