import React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';

interface DateFieldProps {
  label: string;
  value: Dayjs | null;
  onChange: (value: Dayjs | null) => void;
  required?: boolean;
  disabled?: boolean;
}

const DateField: React.FC<DateFieldProps> = ({ label, value, onChange, required, disabled }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        value={value}
        onChange={onChange}
        disabled={disabled}
        slotProps={{ textField: { fullWidth: true, margin: 'normal', required } }}
      />
    </LocalizationProvider>
  );
};

export default DateField;