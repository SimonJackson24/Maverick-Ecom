import React from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';

const EmailPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Email Management
      </Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        Manage your email campaigns and customer communications.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Email Campaigns
              </Typography>
              <Typography variant="body1">
                Email campaign management features coming soon...
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Templates
              </Typography>
              <Typography variant="body1">
                Email template management features coming soon...
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmailPage;
