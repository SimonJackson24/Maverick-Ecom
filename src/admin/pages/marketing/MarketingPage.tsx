import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LocalOffer, Loyalty, Email, Campaign } from '@mui/icons-material';

const MarketingPage: React.FC = () => {
  const navigate = useNavigate();

  const marketingFeatures = [
    {
      title: 'Coupons & Discounts',
      description: 'Create and manage promotional coupons and discount codes',
      icon: <LocalOffer sx={{ fontSize: 40, mb: 2 }} />,
      path: 'coupons',
    },
    {
      title: 'Loyalty Program',
      description: 'Set up and manage customer rewards and loyalty tiers',
      icon: <Loyalty sx={{ fontSize: 40, mb: 2 }} />,
      path: 'loyalty',
    },
    {
      title: 'Email Campaigns',
      description: 'Create and track email marketing campaigns',
      icon: <Email sx={{ fontSize: 40, mb: 2 }} />,
      path: 'email-campaigns',
    },
    {
      title: 'Promotions',
      description: 'Plan and execute promotional campaigns',
      icon: <Campaign sx={{ fontSize: 40, mb: 2 }} />,
      path: 'promotions',
      comingSoon: true,
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Marketing
      </Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        Manage your marketing campaigns, promotions, and customer loyalty programs.
      </Typography>

      <Grid container spacing={3}>
        {marketingFeatures.map((feature) => (
          <Grid item xs={12} md={6} key={feature.path}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: feature.comingSoon ? 'default' : 'pointer',
                opacity: feature.comingSoon ? 0.7 : 1,
              }}
            >
              <CardContent sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                textAlign: 'center',
                flexGrow: 1,
              }}>
                {feature.icon}
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                  {feature.comingSoon && (
                    <Typography
                      component="span"
                      variant="caption"
                      sx={{
                        ml: 1,
                        backgroundColor: 'primary.main',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '0.7rem',
                      }}
                    >
                      Coming Soon
                    </Typography>
                  )}
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  {feature.description}
                </Typography>
                {!feature.comingSoon && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(feature.path)}
                    sx={{ mt: 'auto' }}
                  >
                    Manage
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MarketingPage;
