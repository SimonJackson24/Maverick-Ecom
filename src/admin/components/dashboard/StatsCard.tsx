import React from 'react';
import { Card, CardContent, Typography, Box, IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import { TrendingUp, TrendingDown, MoreVert } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface QuickAction {
  label: string;
  icon: React.ReactNode;
  path: string;
  description: string;
}

interface StatsCardProps {
  title: string;
  value: string;
  trend?: number;
  icon: React.ReactNode;
  comparison?: string;
  quickActions?: QuickAction[];
  backgroundColor: string;
  textColor: string;
}

const getColorScheme = (title: string) => {
  switch (title.toLowerCase()) {
    case 'total revenue':
      return {
        bg: 'rgb(224, 236, 255)', // Deeper blue-50
        text: 'rgb(29, 78, 216)', // blue-700
        iconBg: 'rgb(199, 221, 254)', // Deeper blue-100
      };
    case 'orders':
      return {
        bg: 'rgb(254, 226, 226)', // Deeper red-50
        text: 'rgb(185, 28, 28)', // red-700
        iconBg: 'rgb(254, 202, 202)', // Deeper red-100
      };
    case 'customers':
      return {
        bg: 'rgb(220, 243, 225)', // Deeper green-50
        text: 'rgb(21, 128, 61)', // green-700
        iconBg: 'rgb(187, 247, 208)', // Deeper green-100
      };
    case 'products':
      return {
        bg: 'rgb(255, 237, 213)', // Deeper orange-50
        text: 'rgb(194, 65, 12)', // orange-700
        iconBg: 'rgb(254, 215, 170)', // Deeper orange-100
      };
    default:
      return {
        bg: 'rgb(224, 236, 255)',
        text: 'rgb(29, 78, 216)',
        iconBg: 'rgb(199, 221, 254)',
      };
  }
};

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  trend,
  icon,
  comparison,
  quickActions = [],
  backgroundColor,
  textColor,
}) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const colors = getColorScheme(title);
  const showTrend = trend !== undefined;

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleActionClick = (path: string) => {
    navigate(path);
    handleMenuClose();
  };

  return (
    <Card
      sx={{
        height: '100%',
        backgroundColor: colors.bg,
        border: 'none',
        boxShadow: '0 2px 4px rgba(0,0,0,0.04), 0 4px 8px rgba(0,0,0,0.06)',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 8px rgba(0,0,0,0.06), 0 8px 16px rgba(0,0,0,0.08)',
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                p: 1,
                borderRadius: 2,
                backgroundColor: colors.iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.text,
              }}
            >
              {icon}
            </Box>
            <Box>
              <Typography
                variant="body2"
                sx={{
                  color: colors.text,
                  fontWeight: 600,
                  opacity: 0.9,
                }}
              >
                {title}
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  color: colors.text,
                  fontWeight: 700,
                  lineHeight: 1.2,
                  mt: 0.5,
                }}
              >
                {value}
              </Typography>
            </Box>
          </Box>
          {quickActions.length > 0 && (
            <Box>
              <IconButton
                size="small"
                onClick={handleMenuClick}
                sx={{ color: colors.text }}
              >
                <MoreVert />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                onClick={(e) => e.stopPropagation()}
              >
                {quickActions.map((action) => (
                  <Tooltip key={action.path} title={action.description} placement="left">
                    <MenuItem onClick={() => handleActionClick(action.path)}>
                      <ListItemIcon>{action.icon}</ListItemIcon>
                      <ListItemText primary={action.label} />
                    </MenuItem>
                  </Tooltip>
                ))}
              </Menu>
            </Box>
          )}
        </Box>

        {showTrend && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mt: 2,
              pt: 2,
              borderTop: '1px solid',
              borderColor: `${colors.text}15`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {trend >= 0 ? (
                <TrendingUp 
                  sx={{ 
                    fontSize: '1.1rem', 
                    mr: 0.5,
                    color: 'success.main'
                  }} 
                />
              ) : (
                <TrendingDown 
                  sx={{ 
                    fontSize: '1.1rem', 
                    mr: 0.5,
                    color: 'error.main'
                  }} 
                />
              )}
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: trend >= 0 ? 'success.main' : 'error.main',
                }}
              >
                {Math.abs(trend).toFixed(2)}%
              </Typography>
            </Box>
            {comparison && (
              <Typography
                component="span"
                variant="body2"
                sx={{
                  color: colors.text,
                  opacity: 0.7,
                  ml: 1,
                  fontWeight: 500,
                }}
              >
                vs {comparison}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
