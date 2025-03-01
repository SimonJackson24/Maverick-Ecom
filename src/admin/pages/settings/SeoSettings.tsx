import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Switch,
  FormControlLabel,
  Snackbar,
  Paper,
  Autocomplete,
  MenuItem,
  Tooltip,
  IconButton,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { GET_SEO_SETTINGS, UPDATE_SEO_SETTINGS } from '../../graphql/seo';

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

// Default SEO settings structure
const defaultSettings = {
  defaultTitle: '',
  defaultDescription: '',
  defaultKeywords: '',
  robotsTxt: 'User-agent: *\nAllow: /',
  sitemapEnabled: true,
  canonicalUrlsEnabled: true,
  socialImage: '',
  googleVerification: '',
  bingVerification: '',
  breadcrumbs: {
    enabled: true,
    separator: '›',
    homepageTitle: 'Home'
  },
  contentAnalysis: {
    enabled: true,
    keywordDensity: true,
    readabilityAnalysis: true,
    seoScore: true,
    focusKeywordSuggestions: true
  },
  localSeo: {
    enabled: true,
    businessType: 'LocalBusiness',
    businessName: '',
    address: {
      streetAddress: '',
      addressLocality: '',
      addressRegion: '',
      postalCode: '',
      addressCountry: ''
    }
  }
} as const;

// Type for our SEO settings
type SeoSettings = typeof defaultSettings;

const SeoSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const { data, loading, error } = useQuery(GET_SEO_SETTINGS);
  const [updateSeoSettings, { loading: updating }] = useMutation(UPDATE_SEO_SETTINGS);
  
  // Initialize settings with default values
  const [settings, setSettings] = useState<SeoSettings>(() => ({
    ...defaultSettings,
    contentAnalysis: { ...defaultSettings.contentAnalysis },
    localSeo: { 
      ...defaultSettings.localSeo,
      address: { ...defaultSettings.localSeo.address }
    },
    breadcrumbs: { ...defaultSettings.breadcrumbs }
  }));

  useEffect(() => {
    if (data?.seoSettings) {
      // Merge incoming data with defaults to ensure all properties exist
      setSettings(prevSettings => ({
        ...prevSettings,
        ...data.seoSettings,
        contentAnalysis: {
          ...prevSettings.contentAnalysis,
          ...(data.seoSettings.contentAnalysis || {})
        },
        localSeo: {
          ...prevSettings.localSeo,
          ...(data.seoSettings.localSeo || {}),
          address: {
            ...prevSettings.localSeo.address,
            ...(data.seoSettings.localSeo?.address || {})
          }
        },
        breadcrumbs: {
          ...prevSettings.breadcrumbs,
          ...(data.seoSettings.breadcrumbs || {})
        }
      }));
    }
  }, [data]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSave = async () => {
    try {
      await updateSeoSettings({
        variables: {
          input: settings,
        },
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating SEO settings:', err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error loading SEO settings: {error.message}
      </Alert>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ flexGrow: 1 }}>
            SEO Settings
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={updating}
            startIcon={updating ? <CircularProgress size={20} /> : <SaveIcon />}
          >
            {updating ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Configure your store's SEO settings to improve search engine visibility and rankings.
        </Typography>
      </Paper>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          <Tab label="General" />
          <Tab label="Content Analysis" />
          <Tab label="Titles & Meta" />
          <Tab label="Social Media" />
          <Tab label="Sitemap" />
          <Tab label="Local SEO" />
          <Tab label="Rich Snippets" />
          <Tab label="Webmaster Tools" />
          <Tab label="Redirections" />
          <Tab label="Advanced" />
        </Tabs>
      </Box>

      {/* General Tab */}
      <TabPanel value={activeTab} index={0}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                General Settings
              </Typography>
              <Tooltip title="Configure global SEO settings that apply to your entire store">
                <IconButton size="small">
                  <HelpOutlineIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Site Title"
                  value={settings.defaultTitle}
                  onChange={(e) => setSettings((prev) => ({ ...prev, defaultTitle: e.target.value }))}
                  helperText="Your site's main title (e.g., Wick & Wax Co)"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Default Meta Description"
                  value={settings.defaultDescription}
                  onChange={(e) => setSettings((prev) => ({ ...prev, defaultDescription: e.target.value }))}
                  helperText="Default description for pages without a specific meta description"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Default Keywords"
                  value={settings.defaultKeywords}
                  onChange={(e) => setSettings((prev) => ({ ...prev, defaultKeywords: e.target.value }))}
                  helperText="Comma-separated list of default keywords"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Robots.txt Content"
                  value={settings.robotsTxt}
                  onChange={(e) => setSettings((prev) => ({ ...prev, robotsTxt: e.target.value }))}
                  helperText="Content for your robots.txt file"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.sitemapEnabled}
                      onChange={(e) => setSettings((prev) => ({ ...prev, sitemapEnabled: e.target.checked }))}
                    />
                  }
                  label="Enable XML Sitemap"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.canonicalUrlsEnabled}
                      onChange={(e) => setSettings((prev) => ({ ...prev, canonicalUrlsEnabled: e.target.checked }))}
                    />
                  }
                  label="Enable Canonical URLs"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Social Image URL"
                  value={settings.socialImage}
                  onChange={(e) => setSettings((prev) => ({ ...prev, socialImage: e.target.value }))}
                  helperText="Default image URL for social media sharing"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Content Analysis Tab */}
      <TabPanel value={activeTab} index={1}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Content Analysis Settings
              </Typography>
              <Tooltip title="Configure how content is analyzed for SEO optimization">
                <IconButton size="small">
                  <HelpOutlineIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.contentAnalysis.enabled}
                      onChange={(e) => setSettings((prev) => ({ ...prev, contentAnalysis: { ...prev.contentAnalysis, enabled: e.target.checked } }))}
                    />
                  }
                  label="Enable Content Analysis"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.contentAnalysis.keywordDensity}
                      onChange={(e) => setSettings((prev) => ({ ...prev, contentAnalysis: { ...prev.contentAnalysis, keywordDensity: e.target.checked } }))}
                    />
                  }
                  label="Analyze Keyword Density"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.contentAnalysis.readabilityAnalysis}
                      onChange={(e) => setSettings((prev) => ({ ...prev, contentAnalysis: { ...prev.contentAnalysis, readabilityAnalysis: e.target.checked } }))}
                    />
                  }
                  label="Enable Readability Analysis"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.contentAnalysis.seoScore}
                      onChange={(e) => setSettings((prev) => ({ ...prev, contentAnalysis: { ...prev.contentAnalysis, seoScore: e.target.checked } }))}
                    />
                  }
                  label="Show SEO Score"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.contentAnalysis.focusKeywordSuggestions}
                      onChange={(e) => setSettings((prev) => ({ ...prev, contentAnalysis: { ...prev.contentAnalysis, focusKeywordSuggestions: e.target.checked } }))}
                    />
                  }
                  label="Enable Focus Keyword Suggestions"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Titles & Meta Tab */}
      <TabPanel value={activeTab} index={2}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Titles & Meta Settings
              </Typography>
              <Tooltip title="Configure how titles and meta descriptions appear across your site">
                <IconButton size="small">
                  <HelpOutlineIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title Separator"
                  select
                  value={settings.breadcrumbs.separator}
                  onChange={(e) => setSettings((prev) => ({
                    ...prev,
                    breadcrumbs: { ...prev.breadcrumbs, separator: e.target.value }
                  }))}
                  helperText="Character to use between title parts"
                >
                  {['›', '-', '|', '•', ':', '~', '»'].map((sep) => (
                    <MenuItem key={sep} value={sep}>
                      {sep}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.breadcrumbs.enabled}
                      onChange={(e) => setSettings((prev) => ({
                        ...prev,
                        breadcrumbs: { ...prev.breadcrumbs, enabled: e.target.checked }
                      }))}
                    />
                  }
                  label="Enable Breadcrumbs"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Social Media Tab */}
      <TabPanel value={activeTab} index={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Social Media Settings
              </Typography>
              <Tooltip title="Configure how your content appears when shared on social media">
                <IconButton size="small">
                  <HelpOutlineIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Default Social Image"
                  value={settings.socialImage}
                  onChange={(e) => setSettings((prev) => ({ ...prev, socialImage: e.target.value }))}
                  helperText="Default image URL used when sharing pages on social media"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Sitemap Tab */}
      <TabPanel value={activeTab} index={4}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Sitemap Settings
              </Typography>
              <Tooltip title="Configure your XML sitemap settings">
                <IconButton size="small">
                  <HelpOutlineIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.sitemapEnabled}
                      onChange={(e) => setSettings((prev) => ({ ...prev, sitemapEnabled: e.target.checked }))}
                    />
                  }
                  label="Enable XML Sitemap"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.canonicalUrlsEnabled}
                      onChange={(e) => setSettings((prev) => ({ ...prev, canonicalUrlsEnabled: e.target.checked }))}
                    />
                  }
                  label="Enable Canonical URLs"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Local SEO Tab */}
      <TabPanel value={activeTab} index={5}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Local SEO Settings
              </Typography>
              <Tooltip title="Configure your local business information for better local search visibility">
                <IconButton size="small">
                  <HelpOutlineIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.localSeo.enabled}
                      onChange={(e) => setSettings((prev) => ({ ...prev, localSeo: { ...prev.localSeo, enabled: e.target.checked } }))}
                    />
                  }
                  label="Enable Local SEO"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Business Type"
                  value={settings.localSeo.businessType}
                  onChange={(e) => setSettings((prev) => ({ ...prev, localSeo: { ...prev.localSeo, businessType: e.target.value } }))}
                >
                  {[
                    'LocalBusiness',
                    'Store',
                    'Restaurant',
                    'Organization',
                    'Service'
                  ].map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Business Name"
                  value={settings.localSeo.businessName}
                  onChange={(e) => setSettings((prev) => ({ ...prev, localSeo: { ...prev.localSeo, businessName: e.target.value } }))}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Business Address
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Street Address"
                      value={settings.localSeo.address.streetAddress}
                      onChange={(e) => setSettings((prev) => ({ ...prev, localSeo: { ...prev.localSeo, address: { ...prev.localSeo.address, streetAddress: e.target.value } } }))}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="City"
                      value={settings.localSeo.address.addressLocality}
                      onChange={(e) => setSettings((prev) => ({ ...prev, localSeo: { ...prev.localSeo, address: { ...prev.localSeo.address, addressLocality: e.target.value } } }))}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Region"
                      value={settings.localSeo.address.addressRegion}
                      onChange={(e) => setSettings((prev) => ({ ...prev, localSeo: { ...prev.localSeo, address: { ...prev.localSeo.address, addressRegion: e.target.value } } }))}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Postal Code"
                      value={settings.localSeo.address.postalCode}
                      onChange={(e) => setSettings((prev) => ({ ...prev, localSeo: { ...prev.localSeo, address: { ...prev.localSeo.address, postalCode: e.target.value } } }))}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Country"
                      value={settings.localSeo.address.addressCountry}
                      onChange={(e) => setSettings((prev) => ({ ...prev, localSeo: { ...prev.localSeo, address: { ...prev.localSeo.address, addressCountry: e.target.value } } }))}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Webmaster Tools Tab */}
      <TabPanel value={activeTab} index={7}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Webmaster Tools Settings
              </Typography>
              <Tooltip title="Add verification codes for various webmaster tools">
                <IconButton size="small">
                  <HelpOutlineIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Google Verification Code"
                  value={settings.googleVerification}
                  onChange={(e) => setSettings((prev) => ({ ...prev, googleVerification: e.target.value }))}
                  helperText="Google Search Console verification code"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Bing Verification Code"
                  value={settings.bingVerification}
                  onChange={(e) => setSettings((prev) => ({ ...prev, bingVerification: e.target.value }))}
                  helperText="Bing Webmaster Tools verification code"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Rich Snippets Tab */}
      <TabPanel value={activeTab} index={6}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Rich Snippets Settings
              </Typography>
              <Tooltip title="Configure structured data for rich snippets in search results">
                <IconButton size="small">
                  <HelpOutlineIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Alert severity="info" sx={{ mb: 2 }}>
              Rich Snippets are automatically generated based on your product and content structure.
              Additional configuration options will be available in a future update.
            </Alert>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Redirections Tab */}
      <TabPanel value={activeTab} index={8}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Redirections
              </Typography>
              <Tooltip title="Manage URL redirections">
                <IconButton size="small">
                  <HelpOutlineIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Alert severity="info" sx={{ mb: 2 }}>
              URL redirection management will be available in a future update.
            </Alert>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Advanced Tab */}
      <TabPanel value={activeTab} index={9}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Advanced Settings
              </Typography>
              <Tooltip title="Configure advanced SEO settings">
                <IconButton size="small">
                  <HelpOutlineIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Robots.txt Content"
                  value={settings.robotsTxt}
                  onChange={(e) => setSettings((prev) => ({ ...prev, robotsTxt: e.target.value }))}
                  helperText="Custom robots.txt content"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        message="SEO settings saved successfully"
      />
    </Box>
  );
};

export default SeoSettings;
