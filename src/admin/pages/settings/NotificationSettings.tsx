import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  FormControlLabel,
  Switch,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
} from '@mui/material';

const NotificationSettings: React.FC = () => {
  const [emailNotifications, setEmailNotifications] = React.useState({
    newOrders: true,
    lowStock: true,
    customerMessages: true,
    reviews: true,
    security: true,
  });

  const [pushNotifications, setPushNotifications] = React.useState({
    newOrders: false,
    lowStock: true,
    customerMessages: true,
    reviews: false,
    security: true,
  });

  const [emailRecipients, setEmailRecipients] = React.useState('admin@wickandwax.co');

  const handleSave = () => {
    // TODO: Implement notification settings save
    console.log({
      emailNotifications,
      pushNotifications,
      emailRecipients,
    });
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Notification Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Configure how and when you receive notifications
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Email Notifications
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="New Orders"
                    secondary="Get notified when a new order is placed"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={emailNotifications.newOrders}
                      onChange={(e) =>
                        setEmailNotifications({
                          ...emailNotifications,
                          newOrders: e.target.checked,
                        })
                      }
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Low Stock Alerts"
                    secondary="Get notified when products are running low"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={emailNotifications.lowStock}
                      onChange={(e) =>
                        setEmailNotifications({
                          ...emailNotifications,
                          lowStock: e.target.checked,
                        })
                      }
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Customer Messages"
                    secondary="Get notified when customers send messages"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={emailNotifications.customerMessages}
                      onChange={(e) =>
                        setEmailNotifications({
                          ...emailNotifications,
                          customerMessages: e.target.checked,
                        })
                      }
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Reviews"
                    secondary="Get notified of new product reviews"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={emailNotifications.reviews}
                      onChange={(e) =>
                        setEmailNotifications({
                          ...emailNotifications,
                          reviews: e.target.checked,
                        })
                      }
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Security Alerts"
                    secondary="Get notified of important security events"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={emailNotifications.security}
                      onChange={(e) =>
                        setEmailNotifications({
                          ...emailNotifications,
                          security: e.target.checked,
                        })
                      }
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Push Notifications
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="New Orders"
                    secondary="Get browser notifications for new orders"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={pushNotifications.newOrders}
                      onChange={(e) =>
                        setPushNotifications({
                          ...pushNotifications,
                          newOrders: e.target.checked,
                        })
                      }
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Low Stock Alerts"
                    secondary="Get browser notifications for low stock"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={pushNotifications.lowStock}
                      onChange={(e) =>
                        setPushNotifications({
                          ...pushNotifications,
                          lowStock: e.target.checked,
                        })
                      }
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Customer Messages"
                    secondary="Get browser notifications for customer messages"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={pushNotifications.customerMessages}
                      onChange={(e) =>
                        setPushNotifications({
                          ...pushNotifications,
                          customerMessages: e.target.checked,
                        })
                      }
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Reviews"
                    secondary="Get browser notifications for new reviews"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={pushNotifications.reviews}
                      onChange={(e) =>
                        setPushNotifications({
                          ...pushNotifications,
                          reviews: e.target.checked,
                        })
                      }
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Security Alerts"
                    secondary="Get browser notifications for security events"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={pushNotifications.security}
                      onChange={(e) =>
                        setPushNotifications({
                          ...pushNotifications,
                          security: e.target.checked,
                        })
                      }
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Email Recipients
              </Typography>
              <TextField
                fullWidth
                label="Notification Emails"
                value={emailRecipients}
                onChange={(e) => setEmailRecipients(e.target.value)}
                helperText="Separate multiple email addresses with commas"
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="contained" onClick={handleSave}>
              Save Changes
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NotificationSettings;
