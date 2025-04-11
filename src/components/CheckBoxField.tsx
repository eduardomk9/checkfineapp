import React from 'react';
import { FormControlLabel, Checkbox } from '@mui/material';

interface CheckBoxFieldProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  required?: boolean;
  disabled?: boolean;
}

const CheckBoxField: React.FC<CheckBoxFieldProps> = ({ label, value, onChange, required, disabled }) => {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={value || false}
          onChange={(e) => onChange(e.target.checked)}
          required={required}
          disabled={disabled}
        />
      }
      label={label}
      sx={{ margin: 'normal' }}
    />
  );
};

export default CheckBoxField;