import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Divider,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Check as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  ContentCopy as ContentCopyIcon,
} from '@mui/icons-material';

interface ContentSuggestion {
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
  details?: string;
}

interface KeywordDensity {
  keyword: string;
  count: number;
  density: number;
}

interface ContentAnalysis {
  readabilityScore: number;
  wordCount: number;
  keywordDensity: KeywordDensity[];
  suggestions: ContentSuggestion[];
  headingStructure: string[];
  metaTagsStatus: {
    title: boolean;
    description: boolean;
    keywords: boolean;
  };
}

export const ContentOptimizer: React.FC = () => {
  const [content, setContent] = useState('');
  const [targetKeywords, setTargetKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ContentAnalysis | null>(null);

  const analyzeContent = async () => {
    setLoading(true);
    try {
      // Simulated API call to content analysis service
      // In production, this would call your backend service
      await new Promise(resolve => setTimeout(resolve, 1000));

      const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
      const keywords = targetKeywords.split(',').map(k => k.trim());
      
      const keywordDensity = keywords.map(keyword => {
        const regex = new RegExp(keyword, 'gi');
        const count = (content.match(regex) || []).length;
        return {
          keyword,
          count,
          density: (count / wordCount) * 100
        };
      });

      const headings = content.match(/<h[1-6][^>]*>.*?<\/h[1-6]>/gi) || [];

      const suggestions: ContentSuggestion[] = [];

      // Word count check
      if (wordCount < 300) {
        suggestions.push({
          type: 'warning',
          message: 'Content length is below recommended minimum of 300 words',
          details: 'Consider adding more detailed information to improve content depth'
        });
      }

      // Keyword density check
      keywordDensity.forEach(kd => {
        if (kd.density > 3) {
          suggestions.push({
            type: 'warning',
            message: `Keyword "${kd.keyword}" appears too frequently (${kd.density.toFixed(1)}%)`,
            details: 'Consider reducing keyword density to avoid over-optimization'
          });
        } else if (kd.density < 0.5) {
          suggestions.push({
            type: 'info',
            message: `Keyword "${kd.keyword}" could be used more frequently`,
            details: 'Aim for a keyword density between 0.5% and 3%'
          });
        }
      });

      // Heading structure check
      if (!headings.some(h => h.startsWith('<h1'))) {
        suggestions.push({
          type: 'error',
          message: 'No H1 heading found',
          details: 'Each page should have exactly one H1 heading'
        });
      }

      setAnalysis({
        readabilityScore: Math.floor(Math.random() * 30) + 70, // Simulated score
        wordCount,
        keywordDensity,
        suggestions,
        headingStructure: headings,
        metaTagsStatus: {
          title: content.includes('<title>'),
          description: content.includes('<meta name="description"'),
          keywords: content.includes('<meta name="keywords"')
        }
      });
    } catch (error) {
      console.error('Error analyzing content:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'warning';
    return 'error';
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckIcon color="success" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'error':
        return <ErrorIcon color="error" />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Content Optimizer
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              multiline
              rows={10}
              label="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your content here (HTML format supported)"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Target Keywords"
              value={targetKeywords}
              onChange={(e) => setTargetKeywords(e.target.value)}
              placeholder="Enter keywords separated by commas"
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={analyzeContent}
              disabled={loading || !content}
              startIcon={<RefreshIcon />}
            >
              Analyze Content
            </Button>
          </Grid>

          <Grid item xs={12} md={6}>
            {loading && <LinearProgress sx={{ mb: 2 }} />}
            
            {analysis && (
              <Box>
                <Paper sx={{ p: 2, mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Readability Score
                      </Typography>
                      <Typography
                        variant="h4"
                        color={getScoreColor(analysis.readabilityScore)}
                      >
                        {analysis.readabilityScore}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Word Count
                      </Typography>
                      <Typography variant="h4">
                        {analysis.wordCount}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Meta Tags
                      </Typography>
                      <Box>
                        <Chip
                          size="small"
                          label="Title"
                          color={analysis.metaTagsStatus.title ? 'success' : 'error'}
                          sx={{ mr: 0.5 }}
                        />
                        <Chip
                          size="small"
                          label="Description"
                          color={analysis.metaTagsStatus.description ? 'success' : 'error'}
                          sx={{ mr: 0.5 }}
                        />
                        <Chip
                          size="small"
                          label="Keywords"
                          color={analysis.metaTagsStatus.keywords ? 'success' : 'error'}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>

                <Typography variant="subtitle1" gutterBottom>
                  Keyword Density
                </Typography>
                <Paper sx={{ p: 2, mb: 2 }}>
                  <Grid container spacing={1}>
                    {analysis.keywordDensity.map((kd) => (
                      <Grid item xs={12} key={kd.keyword}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" sx={{ flexGrow: 1 }}>
                            {kd.keyword}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {kd.count} occurrences ({kd.density.toFixed(1)}%)
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(kd.density * 20, 100)}
                          color={kd.density > 3 ? 'error' : 'primary'}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Paper>

                <Typography variant="subtitle1" gutterBottom>
                  Optimization Suggestions
                </Typography>
                <Paper>
                  <List>
                    {analysis.suggestions.map((suggestion, index) => (
                      <React.Fragment key={index}>
                        {index > 0 && <Divider />}
                        <ListItem>
                          <ListItemIcon>
                            {getSuggestionIcon(suggestion.type)}
                          </ListItemIcon>
                          <ListItemText
                            primary={suggestion.message}
                            secondary={suggestion.details}
                          />
                        </ListItem>
                      </React.Fragment>
                    ))}
                    {analysis.suggestions.length === 0 && (
                      <ListItem>
                        <Alert severity="success" sx={{ width: '100%' }}>
                          No issues found! Your content appears to be well-optimized.
                        </Alert>
                      </ListItem>
                    )}
                  </List>
                </Paper>
              </Box>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
