import React from 'react';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';

interface DateTimeFieldProps {
  label: string;
  value: Dayjs | null;
  onChange: (value: Dayjs | null) => void;
  required?: boolean;
  disabled?: boolean;
}

const DateTimeField: React.FC<DateTimeFieldProps> = ({ label, value, onChange, required, disabled }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        label={label}
        value={value}
        onChange={onChange}
        disabled={disabled}
        slotProps={{ textField: { fullWidth: true, margin: 'normal', required } }}
      />
    </LocalizationProvider>
  );
};

export default DateTimeField;