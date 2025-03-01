import { Outlet } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

export const InventoryLayout = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Inventory Management
      </Typography>
      <Outlet />
    </Box>
  );
};

export default InventoryLayout;
