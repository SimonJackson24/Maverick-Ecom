import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, CardActionArea } from '@mui/material';
import {
  CogIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  TruckIcon,
  CurrencyDollarIcon,
  EnvelopeIcon,
  ChartBarIcon,
  SparklesIcon,
  MegaphoneIcon,
  PuzzlePieceIcon,
} from '@heroicons/react/24/outline';

const settingsCards = [
  { name: 'General', href: '/admin/settings/general', icon: CogIcon, description: 'Basic store information and preferences' },
  { name: 'Security', href: '/admin/settings/security', icon: LockClosedIcon, description: 'Security and access control settings' },
  { name: 'GDPR & Privacy', href: '/admin/settings/gdpr', icon: ShieldCheckIcon, description: 'Data protection and privacy settings' },
  { name: 'Products', href: '/admin/settings/products', icon: ShoppingBagIcon, description: 'Product management settings' },
  { name: 'Shipping', href: '/admin/settings/shipping', icon: TruckIcon, description: 'Shipping methods and rates' },
  { name: 'Payment', href: '/admin/settings/payment', icon: CurrencyDollarIcon, description: 'Payment methods and processing' },
  { name: 'Email', href: '/admin/settings/email', icon: EnvelopeIcon, description: 'Email templates and notifications' },
  { name: 'Analytics', href: '/admin/settings/analytics', icon: ChartBarIcon, description: 'Analytics and tracking settings' },
  { name: 'Scent Features', href: '/admin/settings/scent', icon: SparklesIcon, description: 'Scent-related features and options' },
  { name: 'Marketing', href: '/admin/settings/marketing', icon: MegaphoneIcon, description: 'Marketing and promotions settings' },
  { name: 'Integrations', href: '/admin/settings/integrations', icon: PuzzlePieceIcon, description: 'Third-party service integrations' },
];

const SettingsIndexPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Settings
      </Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        Configure your store settings and preferences
      </Typography>

      <Grid container spacing={3}>
        {settingsCards.map((setting) => (
          <Grid item xs={12} sm={6} md={4} key={setting.name}>
            <Card>
              <CardActionArea onClick={() => navigate(setting.href)}>
                <CardContent className="flex items-start space-x-4 p-4">
                  <setting.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                  <div>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {setting.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {setting.description}
                    </Typography>
                  </div>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SettingsIndexPage;
