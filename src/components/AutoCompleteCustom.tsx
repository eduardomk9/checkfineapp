import React from 'react';
import { Autocomplete, TextField, darken, lighten, styled, AutocompleteRenderGroupParams } from '@mui/material';

export interface AutoCompleteCustomProps {
  label: string;
  options: { [key: string]: string | number | boolean | null | undefined }[];
  value: { [key: string]: string | number | boolean | null | undefined } | null;
  onChange: (value: { [key: string]: string | number | boolean | null | undefined } | null) => void;
  required?: boolean;
  disabled?: boolean;
  field?: string; // Campo para exibir no label (padrão: "name")
  fieldId?: string; // Campo para identificar o valor (padrão: "id")
  groupByField?: string; // Campo para agrupar (padrão: "firstLetter")
  startAdornment?: React.ReactNode; // Para ícones à esquerda
  endAdornment?: React.ReactNode; // Para ícones à direita (ex.: abrir TreeView)
}

const GroupHeader = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: '-8px',
  padding: '4px 10px',
  color: theme.palette.primary.main,
  backgroundColor:
    theme.palette.mode === 'light'
      ? lighten(theme.palette.primary.light, 0.85)
      : darken(theme.palette.primary.main, 0.8),
}));

const GroupItems = styled('ul')({
  padding: 0,
});

const AutoCompleteCustom: React.FC<AutoCompleteCustomProps> = ({
  label,
  options,
  value,
  onChange,
  required,
  disabled,
  field = 'name',
  fieldId = 'id',
  groupByField = 'firstLetter',
  startAdornment,
  endAdornment,
}) => {
  const formattedOptions = options.map((option): { [key: string]: string | number | boolean | null | undefined } & { firstLetter: string } => {
    const firstLetter = typeof option[field] === 'string' ? option[field][0]?.toUpperCase() : '';
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
      ...option,
    };
  });

  const isOptionEqualToValue = (
    option: { [key: string]: string | number | boolean | null | undefined },
    value: { [key: string]: string | number | boolean | null | undefined } | null
  ) => {
    return option?.[fieldId] === value?.[fieldId];
  };

  const renderGroup = (params: AutocompleteRenderGroupParams) => (
    <li key={params.key}>
      <GroupHeader>{params.group}</GroupHeader>
      <GroupItems>{params.children}</GroupItems>
    </li>
  );

  return (
    <Autocomplete
      options={formattedOptions.sort((a, b) =>
        -(b[groupByField as keyof typeof formattedOptions[number]] as string).localeCompare(
          a[groupByField as keyof typeof formattedOptions[number]] as string
        )
      )}
      groupBy={(option) => option[groupByField as keyof typeof option] as string}
      getOptionLabel={(option) => String(option[field as keyof typeof option] ?? '')}
      isOptionEqualToValue={isOptionEqualToValue}
      value={formattedOptions.find((x) => x[fieldId] === value?.[fieldId]) || null}
      onChange={(_, newValue) => onChange(newValue || null)}
      disabled={disabled}
      fullWidth
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          required={required}
          margin="normal"
          InputProps={{
            ...params.InputProps,
            startAdornment,
            endAdornment,
          }}
        />
      )}
      renderGroup={renderGroup}
      noOptionsText="Nenhuma opção encontrada"
    />
  );
};

export default AutoCompleteCustom;