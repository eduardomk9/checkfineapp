import React from 'react';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';

interface YesNoFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
}

const YesNoField: React.FC<YesNoFieldProps> = ({ label, value, onChange, required, disabled }) => {
  return (
    <FormControl component="fieldset" required={required} margin="normal" fullWidth>
      <FormLabel component="legend">{label}</FormLabel>
      <RadioGroup
        row
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        sx={{ justifyContent: 'space-around' }}
      >
        <FormControlLabel value="Sim" control={<Radio disabled={disabled} />} label="Sim" />
        <FormControlLabel value="Não" control={<Radio disabled={disabled} />} label="Não" />
      </RadioGroup>
    </FormControl>
  );
};

export default YesNoField;