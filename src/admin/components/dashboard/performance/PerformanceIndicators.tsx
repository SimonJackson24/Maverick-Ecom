import React from 'react';
import {
  Card,
  Typography,
  Box,
  Grid,
  LinearProgress,
  Tooltip,
  IconButton,
  Chip,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Info,
  Speed,
  ShoppingCart,
  People,
  AttachMoney,
} from '@mui/icons-material';

interface KPI {
  id: string;
  label: string;
  value: number;
  target: number;
  unit: string;
  trend: number;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  description: string;
  secondaryMetric?: {
    label: string;
    value: number;
    unit: string;
  };
}

interface PerformanceIndicatorsProps {
  kpis: KPI[];
  loading?: boolean;
  error?: Error | null;
  onRefresh?: () => void;
}

const PerformanceIndicators: React.FC<PerformanceIndicatorsProps> = ({
  kpis,
  loading = false,
  error = null,
  onRefresh,
}) => {
  const getProgressColor = (value: number, target: number) => {
    const percentage = (value / target) * 100;
    if (percentage >= 100) return 'success';
    if (percentage >= 75) return 'primary';
    if (percentage >= 50) return 'warning';
    return 'error';
  };

  if (loading) {
    return (
      <Card sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Performance Indicators
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((i) => (
            <Grid item xs={12} md={6} lg={3} key={i}>
              <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ width: 120, height: 24, bgcolor: 'background.paper', borderRadius: 0.5, mb: 1 }} />
                  <Box sx={{ width: 80, height: 40, bgcolor: 'background.paper', borderRadius: 0.5 }} />
                </Box>
                <Box sx={{ width: '100%', height: 4, bgcolor: 'background.paper', borderRadius: 2 }} />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ p: 3 }}>
        <Typography color="error" gutterBottom>
          Error loading performance indicators
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {error.message}
        </Typography>
      </Card>
    );
  }

  return (
    <Card sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Performance Indicators</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {onRefresh && (
            <Tooltip title="Refresh indicators">
              <IconButton onClick={onRefresh} size="small">
                <Speed />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {kpis.map((kpi) => (
          <Grid item xs={12} md={6} lg={3} key={kpi.id}>
            <Box
              sx={{
                p: 2,
                bgcolor: 'background.default',
                borderRadius: 1,
                height: '100%',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton
                    size="small"
                    color={kpi.color}
                    sx={{
                      bgcolor: `${kpi.color}.soft`,
                      '&:hover': {
                        bgcolor: `${kpi.color}.soft`,
                      },
                    }}
                  >
                    {kpi.icon}
                  </IconButton>
                  <Typography variant="body2" color="text.secondary">
                    {kpi.label}
                  </Typography>
                </Box>
                <Tooltip title={kpi.description}>
                  <Info fontSize="small" sx={{ color: 'text.secondary', opacity: 0.7 }} />
                </Tooltip>
              </Box>

              <Box sx={{ mb: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {kpi.value}
                  <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                    {kpi.unit}
                  </Typography>
                </Typography>
                {kpi.secondaryMetric && (
                  <Typography variant="body2" color="text.secondary">
                    {kpi.secondaryMetric.label}: {kpi.secondaryMetric.value}
                    {kpi.secondaryMetric.unit}
                  </Typography>
                )}
              </Box>

              <Box sx={{ mb: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={Math.min((kpi.value / kpi.target) * 100, 100)}
                  color={getProgressColor(kpi.value, kpi.target)}
                  sx={{ height: 4, borderRadius: 2 }}
                />
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Target: {kpi.target}
                  {kpi.unit}
                </Typography>
                <Chip
                  size="small"
                  icon={kpi.trend >= 0 ? <TrendingUp /> : <TrendingDown />}
                  label={`${Math.abs(kpi.trend)}%`}
                  color={kpi.trend >= 0 ? 'success' : 'error'}
                  variant="outlined"
                />
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Card>
  );
};

export default PerformanceIndicators;
