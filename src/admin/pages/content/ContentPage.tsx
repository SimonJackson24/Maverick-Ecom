import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

const ContentPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Content Management
      </Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        Manage your website content, blog posts, and media.
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="body1">
            Content management features coming soon...
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ContentPage;
