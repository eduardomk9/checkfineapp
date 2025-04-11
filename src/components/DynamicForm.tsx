// components/DynamicForm.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import YesNoField from './YesNoField';
import DateField from './DateField';
import TimeField from './TimeField';
import CheckBoxField from './CheckBoxField';
import DateTimeField from './DateTimeField';
import TextFieldField from './TextField';
import { parseToDayjs } from '../utils/parseToDayjs';
import SignatureField from './SignatureField';

interface FieldConfig {
  id: number;
  name: string;
  type: number; // idOpTy
  required?: boolean;
  value?: unknown; // Valor inicial
}

interface DynamicFormProps {
  fields: FieldConfig[];
  values: { [key: number]: unknown };
  onChange: (id: number, value: unknown) => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ fields, values, onChange }) => {
  const renderField = (field: FieldConfig) => {
    const inputValue = field.type === 9 ? '' : values[field.id] ?? '';
  
    switch (field.type) {
      case 2: // Sim ou Não
        return (
          <YesNoField
            label={field.name}
            value={String(inputValue)}
            onChange={(val) => onChange(field.id, val)}
            required={field.required}
          />
        );
      case 3: // Data e Hora
        return (
          <DateTimeField
            label={field.name}
            value={parseToDayjs(inputValue)}
            onChange={(val) => onChange(field.id, val)}
            required={field.required}
          />
        );
      case 4: // Data
        return (
          <DateField
            label={field.name}
            value={parseToDayjs(inputValue)}
            onChange={(val) => onChange(field.id, val)}
            required={field.required}
          />
        );
      case 5: // Hora
        return (
          <TimeField
            label={field.name}
            value={parseToDayjs(inputValue)}
            onChange={(val) => onChange(field.id, val)}
            required={field.required}
          />
        );
      case 6: // Assinatura
        return (
          <SignatureField
            label={field.name}
            value={inputValue ? String(inputValue) : null}
            onChange={(val) => onChange(field.id, val)}
            required={field.required}
          />
        );
      case 7: // CheckBox
        return (
          <CheckBoxField
            label={field.name}
            value={!!inputValue}
            onChange={(val) => onChange(field.id, val)}
            required={field.required}
          />
        );
      case 8: // Texto
        return (
          <TextFieldField
            label={field.name}
            value={String(inputValue)}
            onChange={(val) => onChange(field.id, val)}
            required={field.required}
          />
        );
      case 9: // Label
        return (
          <Typography variant="body1" sx={{ margin: 'normal' }}>
            {field.name}
          </Typography>
        );
      default:
        return (
          <TextFieldField
            label={field.name}
            value={String(inputValue)}
            onChange={(val) => onChange(field.id, val)}
            required={field.required}
          />
        );
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {fields.map((field) => (
        <Box key={field.id}>{renderField(field)}</Box>
      ))}
    </Box>
  );
};

export default DynamicForm;
