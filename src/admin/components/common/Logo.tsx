import React from 'react';
import { Box, useTheme } from '@mui/material';

interface LogoProps {
  variant?: 'full' | 'symbol';
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  variant = 'full',
  size = 'medium',
  color
}) => {
  const theme = useTheme();
  const defaultColor = theme.palette.primary.main;

  const sizeMap = {
    small: variant === 'full' ? 120 : 32,
    medium: variant === 'full' ? 160 : 48,
    large: variant === 'full' ? 240 : 64
  };

  const height = sizeMap[size];
  const logoPath = variant === 'full' 
    ? './assets/images/logo-full.png'
    : './assets/images/logo-symbol.png';

  // Temporary text fallback for development
  const LogoText = () => (
    <Box
      sx={{
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'serif',
        fontSize: height * 0.3,
        fontWeight: 'bold',
        color: color || defaultColor,
        border: '2px dashed',
        borderColor: 'primary.light',
        borderRadius: 1,
        px: 2,
      }}
    >
      Wick & Wax Co
    </Box>
  );

  return <LogoText />;
};

export default Logo;
