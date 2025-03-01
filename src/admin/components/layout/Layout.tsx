import React from 'react';
import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout: React.FC = () => {
  const DRAWER_WIDTH = 280;

  return (
    <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
      <Header />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          pl: { sm: 3 }, 
        }}
      >
        <Toolbar />
        <Box 
          sx={{ 
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            pr: 3, 
            pb: 3, 
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
