import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
  Tabs,
  Tab,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import { useQuery } from '@apollo/client';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Link as LinkIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { GET_SEO_METRICS } from '../../../graphql/queries/seo';
import SeoScoreCard from '../../components/seo/SeoScoreCard';
import KeywordPerformance from '../../components/seo/KeywordPerformance';
import ContentHealthGrid from '../../components/seo/ContentHealthGrid';
import MetaTagManager from '../../components/seo/MetaTagManager';
import UrlManager from '../../components/seo/UrlManager';
import SeoIssuesList from '../../components/seo/SeoIssuesList';

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
      id={`seo-tabpanel-${index}`}
      aria-labelledby={`seo-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const SeoDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { data, loading, error, refetch } = useQuery(GET_SEO_METRICS, {
    fetchPolicy: 'network-only',
    onError: (error) => {
      console.error('Error fetching SEO metrics:', error);
    }
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error loading SEO metrics. Please try again later.
      </Alert>
    );
  }

  const metrics = data?.seoMetrics;

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ flexGrow: 1 }}>
            SEO Dashboard
          </Typography>
          <Button
            startIcon={<RefreshIcon />}
            variant="outlined"
            onClick={() => refetch()}
            sx={{ mr: 2 }}
          >
            Refresh
          </Button>
        </Box>

        {/* Score Cards */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <SeoScoreCard
              title="Overall Score"
              score={metrics?.overallScore || 0}
              trend={metrics?.scoreTrend || 0}
              icon={<SearchIcon />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <SeoScoreCard
              title="Content Health"
              score={metrics?.contentHealthScore || 0}
              trend={metrics?.contentHealthTrend || 0}
              icon={<DescriptionIcon />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <SeoScoreCard
              title="Meta Tags"
              score={metrics?.metaTagScore || 0}
              trend={metrics?.metaTagTrend || 0}
              icon={<DescriptionIcon />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <SeoScoreCard
              title="URLs"
              score={metrics?.urlScore || 0}
              trend={metrics?.urlTrend || 0}
              icon={<LinkIcon />}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          aria-label="SEO dashboard tabs"
        >
          <Tab label="Keywords" />
          <Tab label="Content" />
          <Tab label="Meta Tags" />
          <Tab label="URLs" />
          <Tab label="Issues" />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          <KeywordPerformance data={metrics?.keywordPerformance || []} />
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <ContentHealthGrid data={metrics?.contentHealth || []} />
        </TabPanel>
        <TabPanel value={activeTab} index={2}>
          <MetaTagManager data={metrics?.metaTags || []} />
        </TabPanel>
        <TabPanel value={activeTab} index={3}>
          <UrlManager data={metrics?.urls || []} />
        </TabPanel>
        <TabPanel value={activeTab} index={4}>
          <SeoIssuesList data={metrics?.issues || []} />
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default SeoDashboard;
