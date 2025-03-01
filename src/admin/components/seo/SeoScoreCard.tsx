import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface SeoScoreCardProps {
  title: string;
  score: number;
  trend: number;
  icon: React.ReactNode;
}

const SeoScoreCard: React.FC<SeoScoreCardProps> = ({ title, score, trend, icon }) => {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ mr: 1 }}>{icon}</Box>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress
            variant="determinate"
            value={score}
            size={60}
            sx={{
              color: (theme) =>
                score >= 70
                  ? theme.palette.success.main
                  : score >= 50
                  ? theme.palette.warning.main
                  : theme.palette.error.main,
            }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="caption" component="div" color="text.secondary">
              {score}%
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          {trend > 0 ? (
            <TrendingUp color="success" fontSize="small" />
          ) : (
            <TrendingDown color="error" fontSize="small" />
          )}
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            {Math.abs(trend)}% {trend > 0 ? 'increase' : 'decrease'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SeoScoreCard;
