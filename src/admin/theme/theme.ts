import { createTheme } from '@mui/material/styles';

const colors = {
  purple: {
    light: '#9F7AEA',
    main: '#805AD5',
    dark: '#6B46C1',
  },
  grey: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  white: '#FFFFFF',
  black: '#000000',
};

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      light: colors.purple.light,
      main: colors.purple.main,
      dark: colors.purple.dark,
      contrastText: colors.white,
    },
    background: {
      default: colors.grey[100],
      paper: colors.white,
    },
    text: {
      primary: colors.grey[900],
      secondary: colors.grey[600],
    },
    divider: colors.grey[200],
    success: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
      soft: 'rgba(16, 185, 129, 0.12)',
      contrastText: colors.white,
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
      dark: '#DC2626',
      soft: 'rgba(239, 68, 68, 0.12)',
      contrastText: colors.white,
    },
    warning: {
      main: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706',
      soft: 'rgba(245, 158, 11, 0.12)',
      contrastText: colors.white,
    },
    info: {
      main: '#3B82F6',
      light: '#60A5FA',
      dark: '#2563EB',
      soft: 'rgba(59, 130, 246, 0.12)',
      contrastText: colors.white,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          borderRadius: 12,
          border: `1px solid ${colors.grey[200]}`,
          background: colors.white,
          '&:hover': {
            boxShadow: '0 4px 6px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 6px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.purple.main,
          color: colors.white,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          '& .MuiIconButton-root': {
            color: colors.white,
            '&:hover': {
              backgroundColor: `${colors.purple.dark}40`,
            },
          },
          '& .MuiInputBase-root': {
            color: colors.white,
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: colors.white,
          borderRight: `1px solid ${colors.grey[200]}`,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 8px',
          '&.Mui-selected': {
            backgroundColor: `${colors.purple.main}15`,
            color: colors.purple.main,
            '&:hover': {
              backgroundColor: `${colors.purple.main}25`,
            },
          },
          '&:hover': {
            backgroundColor: colors.grey[100],
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: 'inherit',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: colors.grey[50],
          '& .MuiTableCell-root': {
            color: colors.grey[700],
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${colors.grey[200]}`,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          color: colors.grey[700],
          '&:hover': {
            backgroundColor: colors.grey[100],
          },
        },
      },
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      color: colors.grey[900],
    },
    h2: {
      fontWeight: 700,
      color: colors.grey[900],
    },
    h3: {
      fontWeight: 700,
      color: colors.grey[900],
    },
    h4: {
      fontWeight: 600,
      color: colors.grey[900],
    },
    h5: {
      fontWeight: 600,
      color: colors.grey[900],
    },
    h6: {
      fontWeight: 600,
      color: colors.grey[900],
    },
    subtitle1: {
      color: colors.grey[700],
    },
    subtitle2: {
      color: colors.grey[600],
    },
    body1: {
      color: colors.grey[900],
    },
    body2: {
      color: colors.grey[700],
    },
  },
  shape: {
    borderRadius: 8,
  },
});

export default theme;
