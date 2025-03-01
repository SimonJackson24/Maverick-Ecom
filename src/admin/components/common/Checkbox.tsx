import React from 'react';
import {
  Checkbox as MuiCheckbox,
  CheckboxProps as MuiCheckboxProps,
  FormControlLabel,
} from '@mui/material';

interface CheckboxProps extends Omit<MuiCheckboxProps, 'onChange'> {
  label?: string;
  onChange: (checked: boolean) => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  onChange,
  ...props
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  if (label) {
    return (
      <FormControlLabel
        control={
          <MuiCheckbox
            {...props}
            onChange={handleChange}
            size={props.size || 'small'}
          />
        }
        label={label}
      />
    );
  }

  return (
    <MuiCheckbox
      {...props}
      onChange={handleChange}
      size={props.size || 'small'}
    />
  );
};
