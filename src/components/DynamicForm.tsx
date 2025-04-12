import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import AutoCompleteCustom from './AutoCompleteCustom';
import YesNoField from './YesNoField';
import DateField from './DateField';
import TimeField from './TimeField';
import CheckBoxField from './CheckBoxField';
import DateTimeField from './DateTimeField';
import TextFieldField from './TextField';
import SignatureField from './SignatureField';
import { parseToDayjs } from '../utils/parseToDayjs';
import { getTreeById } from '../services/tree';
import { BranchDto, TreeDto } from '../services/types';

interface FieldConfig {
  id: number;
  name: string;
  type: number;
  required?: boolean;
  value?: unknown;
  idTree?: number;
}

interface DynamicFormProps {
  fields: FieldConfig[];
  values: { [key: number]: unknown };
  onChange: (id: number, value: unknown) => void;
}

interface BranchOption extends BranchDto {
  path: string; // Caminho hierárquico (ex.: "Pai -- Filho")
  isSelectable: boolean;
}

const getTreeOptions = (tree: TreeDto): BranchOption[] => {
  const { branches, onlyFinalOptions } = tree;

  const collectBranches = (branch: BranchDto, parentPath: string = '', level: number = 0): BranchOption[] => {
    const result: BranchOption[] = [];
    const currentPath = parentPath ? `${parentPath} -- ${branch.name}` : branch.name;
    const isSelectable = !onlyFinalOptions || branch.childBranches.length === 0;

    result.push({ ...branch, path: currentPath, isSelectable });

    branch.childBranches.forEach((child) => {
      result.push(...collectBranches(child, currentPath, level + 1));
    });

    return result;
  };

  return branches.reduce((acc, branch) => {
    acc.push(...collectBranches(branch));
    return acc;
  }, [] as BranchOption[]);
};

const DynamicForm: React.FC<DynamicFormProps> = ({ fields, values, onChange }) => {
  const [trees, setTrees] = useState<{ [key: number]: TreeDto }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrees = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('accessToken') || '';
      const treeFields = fields.filter((field) => field.type === 1 && field.idTree);
      const promises = treeFields.map(async (field) => {
        if (field.idTree && !trees[field.idTree]) {
          try {
            console.log(`Buscando árvore com idTree: ${field.idTree}`); // Debug
            const tree = await getTreeById(token, field.idTree);
            setTrees((prev) => ({
              ...prev,
              [field.idTree!]: tree,
            }));
          } catch (err) {
            console.error(`Erro ao buscar árvore ${field.idTree}:`, err);
            setError(`Falha ao carregar árvore ${field.idTree}`);
          }
        }
      });
      await Promise.all(promises);
      setLoading(false);
    };

    if (fields.some((field) => field.type === 1 && field.idTree)) {
      fetchTrees();
    }
  }, [fields, trees]);

  const renderField = (field: FieldConfig) => {
    const inputValue = field.type === 9 ? '' : values[field.id] ?? '';

    switch (field.type) {
      case 1: { // Árvore
        const tree = field.idTree ? trees[field.idTree] : null;
        const options = tree ? getTreeOptions(tree) : [];
         console.log(`Opções para idTree ${field.idTree}:`, options); // Debug
        return (
       <AutoCompleteCustom
          title={field.name}
           field="path"
         fieldId="idBranch"
        options={options}
      value={inputValue}
      onChange={(idBranch) => onChange(field.id, idBranch)}
      required={field.required}
      size="small"
      variant="outlined"
      getOptionDisabled={(option) => !(option as BranchOption).isSelectable}
      treeData={tree}
    />
        );
      }
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

  if (loading) return <Typography>Carregando árvores...</Typography>;
  if (error) return <Typography>Erro: {error}</Typography>;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {fields.map((field) => (
        <Box key={field.id}>{renderField(field)}</Box>
      ))}
    </Box>
  );
};

export default DynamicForm;