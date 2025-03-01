import React from 'react';
import { Box, Typography, styled } from '@mui/material';

interface PageLayoutProps {
  title?: string;
  children: React.ReactNode;
}

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(4),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    marginLeft: 0,
  },
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  maxWidth: '1600px',
  margin: '0 auto',
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const PageTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  color: theme.palette.text.primary,
  fontWeight: 700,
  fontSize: '1.75rem',
  lineHeight: 1.2,
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(3),
    fontSize: '1.5rem',
  },
}));

const PageLayout: React.FC<PageLayoutProps> = ({ title, children }) => {
  return (
    <Box className="flex flex-col min-h-full">
      <Main open={true}>
        <ContentWrapper>
          {title && (
            <PageTitle variant="h1">
              {title}
            </PageTitle>
          )}
          {children}
        </ContentWrapper>
      </Main>
    </Box>
  );
};

export default PageLayout;
