import React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import { 
  Card, 
  Typography, 
  Box, 
  IconButton, 
  Tooltip,
  Skeleton,
  Chip
} from '@mui/material';
import {
  ShoppingBag,
  Person,
  Inventory,
  LocalShipping,
  AttachMoney,
  Refresh,
  Warning
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';

interface Activity {
  id: string;
  type: 'order' | 'customer' | 'product' | 'shipping' | 'payment' | 'alert';
  action: string;
  description: string;
  timestamp: Date;
  metadata?: {
    status?: string;
    amount?: number;
    orderId?: string;
    customerId?: string;
    productId?: string;
    priority?: 'low' | 'medium' | 'high';
  };
}

interface RecentActivityTimelineProps {
  activities: Activity[];
  loading?: boolean;
  error?: Error | null;
  onRefresh?: () => void;
}

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'order':
      return <ShoppingBag />;
    case 'customer':
      return <Person />;
    case 'product':
      return <Inventory />;
    case 'shipping':
      return <LocalShipping />;
    case 'payment':
      return <AttachMoney />;
    case 'alert':
      return <Warning />;
  }
};

const getActivityColor = (type: Activity['type'], priority?: 'low' | 'medium' | 'high') => {
  if (priority) {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
    }
  }

  switch (type) {
    case 'order':
      return 'primary';
    case 'customer':
      return 'success';
    case 'product':
      return 'info';
    case 'shipping':
      return 'secondary';
    case 'payment':
      return 'success';
    case 'alert':
      return 'error';
  }
};

const RecentActivityTimeline: React.FC<RecentActivityTimelineProps> = ({
  activities,
  loading = false,
  error = null,
  onRefresh
}) => {
  if (loading) {
    return (
      <Card sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Skeleton variant="text" width={200} height={32} />
          <Skeleton variant="circular" width={40} height={40} />
        </Box>
        {[1, 2, 3].map((i) => (
          <Box key={i} sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Skeleton variant="circular" width={40} height={40} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" />
            </Box>
          </Box>
        ))}
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ p: 3 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography color="error" gutterBottom>
            Error loading activity timeline
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {error.message}
          </Typography>
        </Box>
      </Card>
    );
  }

  return (
    <Card sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Recent Activity</Typography>
        {onRefresh && (
          <Tooltip title="Refresh activities">
            <IconButton onClick={onRefresh} size="small">
              <Refresh />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <Timeline>
        {activities.map((activity) => (
          <TimelineItem key={activity.id}>
            <TimelineOppositeContent sx={{ flex: 0.2 }}>
              <Typography variant="caption" color="text.secondary">
                {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
              </Typography>
            </TimelineOppositeContent>

            <TimelineSeparator>
              <TimelineDot color={getActivityColor(activity.type, activity.metadata?.priority)}>
                {getActivityIcon(activity.type)}
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>

            <TimelineContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {activity.action}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {activity.description}
                </Typography>
                {activity.metadata?.status && (
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      size="small"
                      label={activity.metadata.status}
                      color={getActivityColor(activity.type, activity.metadata?.priority)}
                    />
                  </Box>
                )}
              </Box>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Card>
  );
};

export default RecentActivityTimeline;
