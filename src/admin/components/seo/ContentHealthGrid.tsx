import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';

interface ContentHealthItem {
  url: string;
  title: string;
  wordCount: number;
  readabilityScore: number;
  keywordDensity: number;
  issues: string[];
}

interface ContentHealthGridProps {
  data: ContentHealthItem[];
}

const ContentHealthGrid: React.FC<ContentHealthGridProps> = ({ data = [] }) => {
  const getHealthIcon = (score: number) => {
    if (score >= 80) {
      return <CheckCircleIcon color="success" />;
    } else if (score >= 60) {
      return <WarningIcon color="warning" />;
    } else {
      return <ErrorIcon color="error" />;
    }
  };

  return (
    <Grid container spacing={3}>
      {data.map((item, index) => (
        <Grid item xs={12} md={6} key={index}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" noWrap>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {item.url}
                  </Typography>
                </Box>
                <Tooltip title={`Health Score: ${item.readabilityScore}%`}>
                  {getHealthIcon(item.readabilityScore)}
                </Tooltip>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Readability Score
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={item.readabilityScore}
                  sx={{
                    height: 8,
                    borderRadius: 5,
                    backgroundColor: (theme) => theme.palette.grey[200],
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 5,
                      backgroundColor: (theme) =>
                        item.readabilityScore >= 80
                          ? theme.palette.success.main
                          : item.readabilityScore >= 60
                          ? theme.palette.warning.main
                          : theme.palette.error.main,
                    },
                  }}
                />
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Word Count
                  </Typography>
                  <Typography variant="body1">{item.wordCount}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Keyword Density
                  </Typography>
                  <Typography variant="body1">{item.keywordDensity}%</Typography>
                </Grid>
              </Grid>

              {item.issues.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Issues to Address
                  </Typography>
                  {item.issues.map((issue, i) => (
                    <Typography
                      key={i}
                      variant="body2"
                      color="error"
                      sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}
                    >
                      <ErrorIcon fontSize="small" sx={{ mr: 0.5 }} />
                      {issue}
                    </Typography>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ContentHealthGrid;
