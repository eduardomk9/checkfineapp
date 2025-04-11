import React from 'react';
import { TextField } from '@mui/material';

interface TextFieldFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
}

const TextFieldField: React.FC<TextFieldFieldProps> = ({
  label,
  value,
  onChange,
  required,
  disabled,
}) => {
  return (
    <TextField
      label={label}
      value={value || ''} // Garante que o valor seja sempre uma string
      onChange={(e) => onChange(e.target.value)}
      fullWidth
      margin="normal"
      required={required}
      disabled={disabled}
    />
  );
};

export default TextFieldField;
