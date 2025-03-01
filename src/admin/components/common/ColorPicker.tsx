import React from 'react';
import { Box, Button, Popover, TextField } from '@mui/material';
import { SketchPicker } from 'react-color';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [displayColor, setDisplayColor] = React.useState(color);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangeComplete = (color: any) => {
    setDisplayColor(color.hex);
    onChange(color.hex);
  };

  const open = Boolean(anchorEl);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Button
        onClick={handleClick}
        sx={{
          width: 40,
          height: 40,
          minWidth: 40,
          p: 0,
          backgroundColor: displayColor,
          '&:hover': {
            backgroundColor: displayColor,
            opacity: 0.8,
          },
          border: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      />
      <TextField
        value={displayColor}
        onChange={(e) => {
          setDisplayColor(e.target.value);
          onChange(e.target.value);
        }}
        size="small"
        sx={{ width: 120 }}
      />
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <SketchPicker
          color={displayColor}
          onChangeComplete={handleChangeComplete}
          disableAlpha
        />
      </Popover>
    </Box>
  );
};

export default ColorPicker;
