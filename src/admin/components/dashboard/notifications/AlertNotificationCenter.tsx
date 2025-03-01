import React from 'react';
import {
  Card,
  Typography,
  Box,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Badge,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Notifications,
  Warning,
  Info,
  Error,
  CheckCircle,
  MoreVert,
  Delete,
  Done,
  Schedule,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';

export type AlertSeverity = 'error' | 'warning' | 'info' | 'success';

interface Alert {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  timestamp: Date;
  read: boolean;
  actionable: boolean;
  category: string;
  metadata?: Record<string, any>;
}

interface AlertNotificationCenterProps {
  alerts: Alert[];
  loading?: boolean;
  error?: Error | null;
  onAlertAction?: (alert: Alert, action: 'read' | 'delete' | 'dismiss') => void;
  onClearAll?: () => void;
  onRefresh?: () => void;
}

const getAlertIcon = (severity: AlertSeverity) => {
  switch (severity) {
    case 'error':
      return <Error color="error" />;
    case 'warning':
      return <Warning color="warning" />;
    case 'info':
      return <Info color="info" />;
    case 'success':
      return <CheckCircle color="success" />;
  }
};

const AlertNotificationCenter: React.FC<AlertNotificationCenterProps> = ({
  alerts,
  loading = false,
  error = null,
  onAlertAction,
  onClearAll,
  onRefresh,
}) => {
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedAlert, setSelectedAlert] = React.useState<Alert | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, alert: Alert) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setSelectedAlert(alert);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedAlert(null);
  };

  const handleAction = (action: 'read' | 'delete' | 'dismiss') => {
    if (selectedAlert && onAlertAction) {
      onAlertAction(selectedAlert, action);
    }
    handleMenuClose();
  };

  const unreadCount = alerts.filter(alert => !alert.read).length;

  if (loading) {
    return (
      <Card sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Notifications</Typography>
          <Box sx={{ width: 40, height: 40, bgcolor: 'background.paper', borderRadius: '50%' }} />
        </Box>
        {[1, 2, 3].map((i) => (
          <Box key={i} sx={{ py: 2 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ width: 40, height: 40, bgcolor: 'background.paper', borderRadius: '50%' }} />
              <Box sx={{ flex: 1 }}>
                <Box sx={{ width: '60%', height: 20, bgcolor: 'background.paper', mb: 1 }} />
                <Box sx={{ width: '40%', height: 16, bgcolor: 'background.paper' }} />
              </Box>
            </Box>
          </Box>
        ))}
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ p: 3 }}>
        <Typography color="error" gutterBottom>
          Error loading notifications
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {error.message}
        </Typography>
      </Card>
    );
  }

  return (
    <Card sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Notifications</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {onRefresh && (
            <Tooltip title="Refresh notifications">
              <IconButton onClick={onRefresh} size="small">
                <Notifications />
              </IconButton>
            </Tooltip>
          )}
          <Badge badgeContent={unreadCount} color="error">
            <Notifications />
          </Badge>
        </Box>
      </Box>

      {alerts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="text.secondary">No notifications</Typography>
        </Box>
      ) : (
        <List>
          {alerts.map((alert) => (
            <React.Fragment key={alert.id}>
              <ListItem
                sx={{
                  bgcolor: alert.read ? 'transparent' : 'action.hover',
                  borderRadius: 1,
                  mb: 1,
                }}
              >
                <ListItemIcon>{getAlertIcon(alert.severity)}</ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {alert.title}
                      </Typography>
                      <Chip
                        size="small"
                        label={alert.category}
                        color={alert.severity}
                        variant="outlined"
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {alert.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                      </Typography>
                    </Box>
                  }
                />
                {alert.actionable && (
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, alert)}
                    sx={{ ml: 1 }}
                  >
                    <MoreVert />
                  </IconButton>
                )}
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
      )}

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem onClick={() => handleAction('read')}>
          <ListItemIcon>
            <Done fontSize="small" />
          </ListItemIcon>
          <ListItemText>Mark as read</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction('dismiss')}>
          <ListItemIcon>
            <Schedule fontSize="small" />
          </ListItemIcon>
          <ListItemText>Dismiss</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleAction('delete')} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {alerts.length > 0 && onClearAll && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Tooltip title="Clear all notifications">
            <IconButton onClick={onClearAll} size="small" color="primary">
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Card>
  );
};

export default AlertNotificationCenter;
