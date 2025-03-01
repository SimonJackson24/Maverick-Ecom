import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Grid,
  Tooltip,
  IconButton,
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface PerformanceMetric {
  timestamp: string;
  lcp: number;
  fid: number;
  cls: number;
  performance: number;
}

export const PerformanceMetricsChart: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/seo/performance-metrics');
      const data = await response.json();
      
      if (data.success) {
        // Transform the data for the chart
        const formattedMetrics = data.data.map((metric: any) => ({
          timestamp: new Date(metric.timestamp).toLocaleDateString(),
          lcp: metric.coreWebVitals.lcp / 1000, // Convert to seconds
          fid: metric.coreWebVitals.fid,
          cls: metric.coreWebVitals.cls,
          performance: metric.lighthouse.performance * 100,
        }));
        setMetrics(formattedMetrics);
      }
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const MetricCard = ({ title, value, target, unit }: { title: string; value: number; target: number; unit: string }) => (
    <Box sx={{ textAlign: 'center', p: 2 }}>
      <Typography variant="subtitle2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h4" color={value <= target ? 'success.main' : 'error.main'}>
        {value.toFixed(2)}{unit}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Target: {target}{unit}
      </Typography>
    </Box>
  );

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Core Web Vitals</Typography>
          <Tooltip title="Refresh metrics">
            <IconButton onClick={fetchMetrics} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={4}>
                <MetricCard
                  title="LCP (Largest Contentful Paint)"
                  value={metrics[metrics.length - 1]?.lcp || 0}
                  target={2.5}
                  unit="s"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <MetricCard
                  title="FID (First Input Delay)"
                  value={metrics[metrics.length - 1]?.fid || 0}
                  target={100}
                  unit="ms"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <MetricCard
                  title="CLS (Cumulative Layout Shift)"
                  value={metrics[metrics.length - 1]?.cls || 0}
                  target={0.1}
                  unit=""
                />
              </Grid>
            </Grid>

            <Box sx={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={metrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <ChartTooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="lcp"
                    stroke="#8884d8"
                    name="LCP (s)"
                  />
                  <Line
                    type="monotone"
                    dataKey="fid"
                    stroke="#82ca9d"
                    name="FID (ms)"
                  />
                  <Line
                    type="monotone"
                    dataKey="cls"
                    stroke="#ffc658"
                    name="CLS"
                  />
                  <Line
                    type="monotone"
                    dataKey="performance"
                    stroke="#ff7300"
                    name="Performance Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};
