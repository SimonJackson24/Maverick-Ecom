import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Email,
  LocalOffer,
  Campaign,
  TrendingUp,
  Group,
  Star,
  Loyalty,
  Settings,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const MarketingDashboard: React.FC = () => {
  const marketingTools = [
    {
      title: 'Email Campaigns',
      description: 'Create and manage email marketing campaigns',
      icon: <Email />,
      path: '/admin/marketing/email',
      stats: {
        active: 2,
        scheduled: 3,
        openRate: '24.5%',
      },
    },
    {
      title: 'Promotions',
      description: 'Manage discounts and special offers',
      icon: <LocalOffer />,
      path: '/admin/marketing/promotions',
      stats: {
        active: 5,
        upcoming: 2,
        redemptions: 156,
      },
    },
    {
      title: 'Loyalty Program',
      description: 'Manage customer rewards and points',
      icon: <Loyalty />,
      path: '/admin/marketing/loyalty',
      stats: {
        members: 250,
        pointsIssued: 12500,
        redemptions: 45,
      },
    },
    {
      title: 'Analytics',
      description: 'View marketing performance metrics',
      icon: <TrendingUp />,
      path: '/admin/marketing/analytics',
      stats: {
        campaigns: 8,
        engagement: '18.2%',
        roi: '245%',
      },
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Marketing
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Campaign />}
          component={Link}
          to="/admin/marketing/campaigns/new"
        >
          New Campaign
        </Button>
      </Box>

      <Grid container spacing={3}>
        {marketingTools.map((tool) => (
          <Grid item xs={12} md={6} lg={3} key={tool.title}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {React.cloneElement(tool.icon as React.ReactElement, {
                    sx: { mr: 1, color: 'primary.main' },
                  })}
                  <Typography variant="h6" component="h2">
                    {tool.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {tool.description}
                </Typography>
                <List dense>
                  {Object.entries(tool.stats).map(([key, value]) => (
                    <ListItem key={key}>
                      <ListItemText
                        primary={value}
                        secondary={key.charAt(0).toUpperCase() + key.slice(1)}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
              <Divider />
              <CardActions>
                <Button
                  component={Link}
                  to={tool.path}
                  size="small"
                  color="primary"
                >
                  Manage
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <List>
                <ListItem button component={Link} to="/admin/marketing/email/new">
                  <ListItemIcon>
                    <Email color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Create Email Campaign"
                    secondary="Design and send a new email campaign"
                  />
                </ListItem>
                <ListItem button component={Link} to="/admin/marketing/promotions/new">
                  <ListItemIcon>
                    <LocalOffer color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Create Promotion"
                    secondary="Set up a new discount or offer"
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <List>
                <ListItem button component={Link} to="/admin/marketing/segments">
                  <ListItemIcon>
                    <Group color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Customer Segments"
                    secondary="Manage customer groups and targeting"
                  />
                </ListItem>
                <ListItem button component={Link} to="/admin/marketing/reviews">
                  <ListItemIcon>
                    <Star color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Customer Reviews"
                    secondary="Manage and respond to reviews"
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <List>
                <ListItem button component={Link} to="/admin/marketing/settings">
                  <ListItemIcon>
                    <Settings color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Marketing Settings"
                    secondary="Configure marketing preferences"
                  />
                </ListItem>
                <ListItem button component={Link} to="/admin/marketing/analytics">
                  <ListItemIcon>
                    <TrendingUp color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Performance Analytics"
                    secondary="View marketing metrics and ROI"
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default MarketingDashboard;
