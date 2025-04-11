import React from 'react';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';

interface TimeFieldProps {
  label: string;
  value: Dayjs | null;
  onChange: (value: Dayjs | null) => void;
  required?: boolean;
  disabled?: boolean;
}

const TimeField: React.FC<TimeFieldProps> = ({ label, value, onChange, required, disabled }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker
        label={label}
        value={value}
        onChange={onChange}
        disabled={disabled}
        slotProps={{ textField: { fullWidth: true, margin: 'normal', required } }}
      />
    </LocalizationProvider>
  );
};

export default TimeField;