import React from 'react';
import { Chip, ChipProps } from '@mui/material';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'default';

interface BadgeProps extends Omit<ChipProps, 'color'> {
  variant?: BadgeVariant;
}

const variantToColor: Record<BadgeVariant, ChipProps['color']> = {
  success: 'success',
  warning: 'warning',
  error: 'error',
  info: 'info',
  default: 'default',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'small',
  ...props
}) => {
  return (
    <Chip
      {...props}
      size={size}
      color={variantToColor[variant]}
      sx={{
        fontWeight: 500,
        ...props.sx,
      }}
    />
  );
};
