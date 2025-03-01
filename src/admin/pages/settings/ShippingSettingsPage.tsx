import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Divider,
  Alert,
} from '@mui/material';
import { useQuery } from '@apollo/client';
import { GET_SHIPPING_SETTINGS } from '../../graphql/shipping';
import ShippingSettings from '../../components/shipping/ShippingSettings';
import ShippingZones from '../../components/shipping/ShippingZones';
import ShippingRules from '../../components/shipping/ShippingRules';
import ShippingLabels from '../../components/shipping/ShippingLabels';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`shipping-tabpanel-${index}`}
      aria-labelledby={`shipping-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ShippingSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { loading, error, data } = useQuery(GET_SHIPPING_SETTINGS);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Error loading shipping settings: {error.message}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Shipping Settings
      </Typography>

      <Paper sx={{ width: '100%', mt: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="shipping settings tabs"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Carriers" />
          <Tab label="Shipping Zones" />
          <Tab label="Shipping Rules" />
          <Tab label="Label Settings" />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          <ShippingSettings
            settings={data?.shippingSettings}
            loading={loading}
          />
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <ShippingZones
            zones={data?.shippingSettings?.zones}
            loading={loading}
          />
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <ShippingRules
            rules={data?.shippingSettings?.rules}
            loading={loading}
          />
        </TabPanel>

        <TabPanel value={activeTab} index={3}>
          <ShippingLabels
            labelSettings={data?.shippingSettings?.labelSettings}
            loading={loading}
          />
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default ShippingSettingsPage;
