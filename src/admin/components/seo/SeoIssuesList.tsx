import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Box,
} from '@mui/material';
import {
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

interface SeoIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  url: string;
  component: string;
}

interface SeoIssuesListProps {
  issues: SeoIssue[];
  fullWidth?: boolean;
}

const SeoIssuesList: React.FC<SeoIssuesListProps> = ({ issues = [], fullWidth = false }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <ErrorIcon color="error" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  const getChipColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <Card sx={{ height: '100%', ...(fullWidth && { width: '100%' }) }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          SEO Issues
        </Typography>
        {issues.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No SEO issues found
          </Typography>
        ) : (
          <List>
            {issues.map((issue) => (
              <ListItem
                key={issue.id}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  mb: 1,
                }}
              >
                <ListItemIcon>{getIcon(issue.type)}</ListItemIcon>
                <ListItemText
                  primary={issue.message}
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      <Chip
                        label={issue.component}
                        size="small"
                        color={getChipColor(issue.type)}
                        sx={{ mr: 1 }}
                      />
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                      >
                        {issue.url}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default SeoIssuesList;
