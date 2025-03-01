import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import {
  ChatBubbleOutline,
  CheckCircleOutline,
  HourglassEmpty,
  Warning,
} from '@mui/icons-material';
import { useQuery } from '@apollo/client';
import { GET_SUPPORT_METRICS, GET_SUPPORT_TICKETS } from '../../../graphql/support';
import AdminLayout from '../../components/layout/AdminLayout';
import { Permission } from '../../types/permissions';
import { SupportMetrics, SupportTicket } from '../../../types/support';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MetricCard: React.FC<{
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: React.ReactNode;
}> = ({ title, value, subtitle, icon }) => (
  <Card>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4">{value}</Typography>
          {subtitle && (
            <Typography variant="subtitle2" color="textSecondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        {icon && <Box>{icon}</Box>}
      </Box>
    </CardContent>
  </Card>
);

const SupportDashboard: React.FC = () => {
  const [timeframe, setTimeframe] = useState<string>('today');
  const [selectedTab, setSelectedTab] = useState(0);

  const { data: metricsData, loading: metricsLoading } = useQuery<{
    supportMetrics: SupportMetrics;
  }>(GET_SUPPORT_METRICS, {
    variables: { timeframe },
  });

  const { data: ticketsData, loading: ticketsLoading } = useQuery(GET_SUPPORT_TICKETS, {
    variables: { filter: { status: ['open', 'in_progress'] } },
  });

  const metrics = metricsData?.supportMetrics;
  const tickets = ticketsData?.supportTickets || [];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  if (metricsLoading || ticketsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <AdminLayout requiredPermissions={[Permission.MANAGE_CUSTOMER_SUPPORT]}>
      <Box p={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Support Dashboard</Typography>
          <Box>
            <Button
              variant={timeframe === 'today' ? 'contained' : 'outlined'}
              onClick={() => setTimeframe('today')}
              sx={{ mr: 1 }}
            >
              Today
            </Button>
            <Button
              variant={timeframe === 'week' ? 'contained' : 'outlined'}
              onClick={() => setTimeframe('week')}
              sx={{ mr: 1 }}
            >
              This Week
            </Button>
            <Button
              variant={timeframe === 'month' ? 'contained' : 'outlined'}
              onClick={() => setTimeframe('month')}
            >
              This Month
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Metrics Overview */}
          <Grid item xs={12} md={3}>
            <MetricCard
              title="Open Tickets"
              value={metrics?.tickets.open || 0}
              icon={<HourglassEmpty color="primary" />}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <MetricCard
              title="Active Chats"
              value={metrics?.chat.activeChats || 0}
              icon={<ChatBubbleOutline color="secondary" />}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <MetricCard
              title="Resolved Today"
              value={metrics?.performance.ticketsResolvedToday || 0}
              icon={<CheckCircleOutline color="success" />}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <MetricCard
              title="Avg Response Time"
              value={`${Math.round(metrics?.tickets.averageResponseTime || 0)}m`}
              icon={<Warning color="warning" />}
            />
          </Grid>

          {/* Performance Charts */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Ticket Volume
              </Typography>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Open', value: metrics?.tickets.open || 0 },
                      { name: 'In Progress', value: metrics?.tickets.inProgress || 0 },
                      { name: 'Resolved', value: metrics?.tickets.resolved || 0 },
                      { name: 'Closed', value: metrics?.tickets.closed || 0 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <Timeline>
                {tickets.slice(0, 5).map((ticket: SupportTicket) => (
                  <TimelineItem key={ticket.id}>
                    <TimelineSeparator>
                      <TimelineDot color={ticket.priority === 'high' ? 'error' : 'primary'} />
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="subtitle2">{ticket.subject}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {new Date(ticket.createdAt).toLocaleString()}
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </Paper>
          </Grid>

          {/* Detailed Stats */}
          <Grid item xs={12}>
            <Paper sx={{ width: '100%' }}>
              <Tabs value={selectedTab} onChange={handleTabChange}>
                <Tab label="Ticket Stats" />
                <Tab label="Chat Stats" />
                <Tab label="Performance" />
              </Tabs>
              <Box p={3}>
                {selectedTab === 0 && (
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <MetricCard
                        title="Average Resolution Time"
                        value={`${Math.round(metrics?.tickets.averageResolutionTime || 0)}h`}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <MetricCard
                        title="Response Time (90th percentile)"
                        value={`${metrics?.performance.responseTimePercentiles.p90 || 0}m`}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <MetricCard
                        title="Total Tickets"
                        value={metrics?.tickets.total || 0}
                      />
                    </Grid>
                  </Grid>
                )}
                {selectedTab === 1 && (
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <MetricCard
                        title="Average Chat Duration"
                        value={`${Math.round(metrics?.chat.averageChatDuration || 0)}m`}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <MetricCard
                        title="Satisfaction Rate"
                        value={`${Math.round((metrics?.chat.satisfactionRate || 0) * 100)}%`}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <MetricCard
                        title="Total Chats Today"
                        value={metrics?.chat.totalChatsToday || 0}
                      />
                    </Grid>
                  </Grid>
                )}
                {selectedTab === 2 && (
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <MetricCard
                        title="Average Satisfaction"
                        value={`${Math.round((metrics?.performance.averageSatisfactionScore || 0) * 100)}%`}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <MetricCard
                        title="Chats Handled Today"
                        value={metrics?.performance.chatsHandledToday || 0}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <MetricCard
                        title="Response Time (99th percentile)"
                        value={`${metrics?.performance.responseTimePercentiles.p99 || 0}m`}
                      />
                    </Grid>
                  </Grid>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </AdminLayout>
  );
};

export default SupportDashboard;
