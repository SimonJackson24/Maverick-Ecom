import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Tabs,
  Tab,
  Chip,
  Autocomplete,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Paper,
  Tooltip,
} from '@mui/material';
import {
  Save as SaveIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { ScentManagementService } from '../../services/ScentManagementService';
import { SeasonalMapping, ScentAttribute } from '../../types';
import AdminLayout from '../../components/layout/AdminLayout';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useSnackbar } from 'notistack';

const SEASONS = ['SPRING', 'SUMMER', 'FALL', 'WINTER'];

interface SeasonalTrend {
  season: string;
  topScents: string[];
  averageIntensity: number;
}

const SeasonalMappingPage: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentSeason, setCurrentSeason] = useState(0);
  const [mappings, setMappings] = useState<Record<string, string[]>>({
    SPRING: [],
    SUMMER: [],
    FALL: [],
    WINTER: [],
  });
  const [availableScents, setAvailableScents] = useState<ScentAttribute[]>([]);
  const [trendsDialogOpen, setTrendsDialogOpen] = useState(false);
  const [seasonalTrends, setSeasonalTrends] = useState<SeasonalTrend[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [scentAttrs, analytics] = await Promise.all([
        ScentManagementService.getScentAttributes(),
        ScentManagementService.getRecommendationAnalytics({
          start: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
          end: new Date(),
        }),
      ]);

      setAvailableScents(scentAttrs);
      setSeasonalTrends(analytics.seasonalTrends);

      // Load existing mappings
      const seasonalMappings = await Promise.all(
        SEASONS.map(async (season) => {
          const response = await ScentManagementService.getSeasonalMapping(season);
          return { season, scents: response };
        })
      );

      const mappingsObj = seasonalMappings.reduce(
        (acc, { season, scents }) => ({
          ...acc,
          [season]: scents,
        }),
        {} as Record<string, string[]>
      );

      setMappings(mappingsObj);
    } catch (error) {
      enqueueSnackbar('Failed to load seasonal mappings', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const mappingsArray: SeasonalMapping[] = Object.entries(mappings).map(
        ([season, scents]) => ({
          season,
          scents,
        })
      );

      await ScentManagementService.updateSeasonalMapping(mappingsArray);
      enqueueSnackbar('Seasonal mappings saved successfully', { variant: 'success' });
      setHasUnsavedChanges(false);
    } catch (error) {
      enqueueSnackbar('Failed to save seasonal mappings', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleScentChange = (season: string, newScents: string[]) => {
    setMappings((prev) => ({
      ...prev,
      [season]: newScents,
    }));
    setHasUnsavedChanges(true);
  };

  const handleApplyTrends = (season: string) => {
    const trend = seasonalTrends.find((t) => t.season === season);
    if (trend) {
      setMappings((prev) => ({
        ...prev,
        [season]: trend.topScents,
      }));
      setHasUnsavedChanges(true);
      enqueueSnackbar('Applied trending scents to ' + season.toLowerCase(), {
        variant: 'success',
      });
    }
  };

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
              <Typography variant="h4">Seasonal Scent Mapping</Typography>
              <Box display="flex" gap={2}>
                <Button
                  startIcon={<TrendingUpIcon />}
                  onClick={() => setTrendsDialogOpen(true)}
                  variant="outlined"
                >
                  View Trends
                </Button>
                <Button
                  startIcon={<RefreshIcon />}
                  onClick={loadData}
                  variant="outlined"
                >
                  Refresh
                </Button>
                <Button
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  variant="contained"
                  color="primary"
                  disabled={saving || !hasUnsavedChanges}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </Box>
          </Grid>

          {hasUnsavedChanges && (
            <Grid item xs={12}>
              <Alert severity="warning">
                You have unsaved changes. Don't forget to save your changes before
                leaving this page.
              </Alert>
            </Grid>
          )}

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Tabs
                  value={currentSeason}
                  onChange={(_, newValue) => setCurrentSeason(newValue)}
                  variant="fullWidth"
                >
                  {SEASONS.map((season) => (
                    <Tab
                      key={season}
                      label={season}
                      icon={
                        <Box display="flex" alignItems="center">
                          {season}
                          {seasonalTrends.some(
                            (trend) =>
                              trend.season === season &&
                              !trend.topScents.every((scent) =>
                                mappings[season].includes(scent)
                              )
                          ) && (
                            <Tooltip title="New trending scents available">
                              <InfoIcon
                                color="primary"
                                fontSize="small"
                                sx={{ ml: 1 }}
                              />
                            </Tooltip>
                          )}
                        </Box>
                      }
                    />
                  ))}
                </Tabs>

                <Box mt={3}>
                  {SEASONS.map((season, index) => (
                    <Box
                      key={season}
                      display={currentSeason === index ? 'block' : 'none'}
                    >
                      <Box display="flex" justifyContent="space-between" mb={2}>
                        <Typography variant="h6">{season} Scents</Typography>
                        <Button
                          size="small"
                          startIcon={<TrendingUpIcon />}
                          onClick={() => handleApplyTrends(season)}
                        >
                          Apply Trending Scents
                        </Button>
                      </Box>

                      <Autocomplete
                        multiple
                        options={availableScents}
                        getOptionLabel={(option) =>
                          typeof option === 'string' ? option : option.name
                        }
                        value={mappings[season].map((scentName) =>
                          availableScents.find((s) => s.name === scentName) || scentName
                        )}
                        onChange={(_, newValue) =>
                          handleScentChange(
                            season,
                            newValue.map((v) =>
                              typeof v === 'string' ? v : v.name
                            )
                          )
                        }
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip
                              label={typeof option === 'string' ? option : option.name}
                              {...getTagProps({ index })}
                            />
                          ))
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder="Add scents..."
                          />
                        )}
                      />
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Dialog
          open={trendsDialogOpen}
          onClose={() => setTrendsDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Seasonal Scent Trends</DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              {seasonalTrends.map((trend) => (
                <Grid item xs={12} md={6} key={trend.season}>
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      {trend.season}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Average Intensity: {trend.averageIntensity.toFixed(1)}
                    </Typography>
                    <Typography variant="subtitle2" gutterBottom>
                      Top Performing Scents:
                    </Typography>
                    <Box display="flex" gap={1} flexWrap="wrap">
                      {trend.topScents.map((scent) => (
                        <Chip
                          key={scent}
                          label={scent}
                          color={
                            mappings[trend.season].includes(scent)
                              ? 'primary'
                              : 'default'
                          }
                          size="small"
                        />
                      ))}
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setTrendsDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AdminLayout>
  );
};

export default SeasonalMappingPage;
