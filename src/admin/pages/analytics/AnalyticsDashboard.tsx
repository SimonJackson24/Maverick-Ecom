import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Tab,
  Tabs,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  DateRange as DateRangeIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { DateRangePicker } from '@mui/x-date-pickers';
import { AnalyticsService } from '../../services/AnalyticsService';
import AdminLayout from '../../components/layout/AdminLayout';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
  SalesAnalytics,
  ScentAnalytics,
  CustomerAnalytics,
  InventoryAnalytics,
  DateRangeInput,
} from '../../types/analytics';

const CHART_COLORS = [
  '#2196F3',
  '#4CAF50',
  '#FFC107',
  '#F44336',
  '#9C27B0',
  '#00BCD4',
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const AnalyticsDashboard: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);
  const [dateRange, setDateRange] = useState<DateRangeInput>({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
  });
  const [salesData, setSalesData] = useState<SalesAnalytics | null>(null);
  const [scentData, setScentData] = useState<ScentAnalytics | null>(null);
  const [customerData, setCustomerData] = useState<CustomerAnalytics | null>(null);
  const [inventoryData, setInventoryData] = useState<InventoryAnalytics | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const dateRangeInput = {
        startDate: dateRange.startDate.toISOString().split('T')[0],
        endDate: dateRange.endDate.toISOString().split('T')[0],
      };

      const [sales, scent, customer, inventory] = await Promise.all([
        AnalyticsService.getSalesAnalytics(dateRangeInput),
        AnalyticsService.getScentAnalytics(dateRangeInput),
        AnalyticsService.getCustomerAnalytics(dateRangeInput),
        AnalyticsService.getInventoryAnalytics(dateRangeInput),
      ]);

      setSalesData(sales);
      setScentData(scent);
      setCustomerData(customer);
      setInventoryData(inventory);
    } catch (error) {
      console.error('Failed to load analytics:', error);
      enqueueSnackbar('Failed to load analytics data', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type: string) => {
    try {
      const result = await AnalyticsService.exportAnalyticsReport(
        type,
        dateRange,
        'CSV'
      );
      window.open(result.url, '_blank');
    } catch (error) {
      enqueueSnackbar('Failed to export report', { variant: 'error' });
    }
  };

  const renderSalesAnalytics = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Total Revenue
          </Typography>
          <Typography variant="h4">
            ${salesData.revenue.total.toLocaleString()}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Orders
          </Typography>
          <Typography variant="h4">{salesData.orders.total}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Conversion Rate
          </Typography>
          <Typography variant="h4">
            {(salesData.conversion.rate * 100).toFixed(2)}%
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Revenue Trend
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData.revenue.byDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#2196F3"
                  name="Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Top Selling Products
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData.products.topSelling}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="quantity" fill="#4CAF50" name="Units Sold" />
                <Bar dataKey="revenue" fill="#FFC107" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Sales Funnel
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={salesData.conversion.funnelStages}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="stage" type="category" />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="count" fill="#2196F3" name="Users" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderScentAnalytics = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Popular Scents
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={scentData.popularScents}
                  dataKey="purchaseCount"
                  nameKey="note"
                  label
                >
                  {scentData.popularScents.map((entry: any, index: number) => (
                    <Cell
                      key={entry.note}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Seasonal Trends
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scentData.seasonalTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="season" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Bar
                  dataKey="averageIntensity"
                  fill="#9C27B0"
                  name="Avg. Intensity"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Customer Preferences
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scentData.customerPreferences}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="segment" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Bar
                  dataKey="averageIntensity"
                  fill="#00BCD4"
                  name="Avg. Intensity"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderCustomerAnalytics = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Customer Acquisition
          </Typography>
          <Typography variant="h4">
            {customerData.acquisition.total}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Average Order Value
          </Typography>
          <Typography variant="h4">
            ${customerData.behavior.averageOrderValue.toFixed(2)}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Retention Rate
          </Typography>
          <Typography variant="h4">
            {(customerData.behavior.retentionRate * 100).toFixed(2)}%
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Customer Segments
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={customerData.segments}
                  dataKey="size"
                  nameKey="name"
                  label
                >
                  {customerData.segments.map((entry: any, index: number) => (
                    <Cell
                      key={entry.name}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Customer Satisfaction
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[customerData.satisfaction]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="nps" fill="#4CAF50" name="NPS" />
                <Bar
                  dataKey="reviewScores"
                  fill="#FFC107"
                  name="Review Score"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderInventoryAnalytics = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Total Products
          </Typography>
          <Typography variant="h4">
            {inventoryData.status.inStock +
              inventoryData.status.lowStock +
              inventoryData.status.outOfStock}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Low Stock Items
          </Typography>
          <Typography variant="h4" color="warning.main">
            {inventoryData.status.lowStock}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Out of Stock
          </Typography>
          <Typography variant="h4" color="error.main">
            {inventoryData.status.outOfStock}
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Inventory Status
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    {
                      name: 'In Stock',
                      value: inventoryData.status.inStock,
                    },
                    {
                      name: 'Low Stock',
                      value: inventoryData.status.lowStock,
                    },
                    {
                      name: 'Out of Stock',
                      value: inventoryData.status.outOfStock,
                    },
                  ]}
                  dataKey="value"
                  nameKey="name"
                  label
                >
                  <Cell fill="#4CAF50" />
                  <Cell fill="#FFC107" />
                  <Cell fill="#F44336" />
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Turnover Rate
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={inventoryData.turnover.byProduct}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="rate" fill="#2196F3" name="Turnover Rate" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <AdminLayout>
      <Box p={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <Typography variant="h4">Analytics Dashboard</Typography>
              <Box display="flex" gap={2}>
                <Button
                  variant="outlined"
                  startIcon={<DateRangeIcon />}
                  onClick={() => {
                    // TODO: Implement date range picker dialog
                  }}
                >
                  {dateRange.startDate.toLocaleDateString()} -{' '}
                  {dateRange.endDate.toLocaleDateString()}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={loadAnalytics}
                >
                  Refresh
                </Button>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={() => handleExport('all')}
                >
                  Export Report
                </Button>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Tabs
              value={currentTab}
              onChange={(_, newValue) => setCurrentTab(newValue)}
              variant="fullWidth"
            >
              <Tab label="Sales" />
              <Tab label="Scents" />
              <Tab label="Customers" />
              <Tab label="Inventory" />
            </Tabs>
          </Grid>

          <Grid item xs={12}>
            <TabPanel value={currentTab} index={0}>
              {renderSalesAnalytics()}
            </TabPanel>
            <TabPanel value={currentTab} index={1}>
              {renderScentAnalytics()}
            </TabPanel>
            <TabPanel value={currentTab} index={2}>
              {renderCustomerAnalytics()}
            </TabPanel>
            <TabPanel value={currentTab} index={3}>
              {renderInventoryAnalytics()}
            </TabPanel>
          </Grid>
        </Grid>
      </Box>
    </AdminLayout>
  );
};

export default AnalyticsDashboard;
