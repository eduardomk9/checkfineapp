// FillForm.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import DynamicForm from '../components/DynamicForm';
import { getTaskTypeById } from '../services/taskType';
import { TaskTypeDto, TaskTypeOptionDto } from '../services/types';
import { useSnackbar } from '../contexts/SnackbarContext';

interface FillFormProps {
  taskId: number;
}

const FillForm: React.FC<FillFormProps> = ({ taskId }) => {
  const [taskType, setTaskType] = useState<TaskTypeDto | null>(null);
  const { showSnackbar } = useSnackbar();
  const BASE_BACKEND_URL = 'http://192.168.15.4:5253'; // URL base do backend

  useEffect(() => {
    const fetchTaskType = async () => {
      const token = localStorage.getItem('accessToken') || '';
      try {
        const taskTypeData = await getTaskTypeById(token, taskId);
        setTaskType(taskTypeData);
      } catch (error) {
        console.error("Erro ao buscar TaskType:", error);
        showSnackbar("Erro ao carregar a tarefa", "error");
      }
    };
    fetchTaskType();
  }, [taskId, showSnackbar]);

  const handleDownload = async (url: string, fileName: string) => {
    console.log("Baixando arquivo:", url);
    try {
      const response = await fetch(`${BASE_BACKEND_URL}/${url}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
        },
      });
      if (!response.ok) throw new Error('Erro ao baixar o arquivo');
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName; // Define o nome do arquivo para download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl); // Libera a memória
    } catch (error) {
      console.error("Erro ao baixar:", error);
      showSnackbar(`Erro ao baixar o arquivo ${fileName}`, "error");
    }
  };

  if (!taskType) return <Typography>Carregando...</Typography>;

  return (
    <Box sx={{ p: 2, backgroundColor: 'white', maxWidth: '800px', mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        {taskType.title}
      </Typography>

      <Typography variant="body1" gutterBottom>
        {taskType.description || 'Sem descrição'}
      </Typography>

      {taskType.taskTypeAttachments && taskType.taskTypeAttachments.length > 0 && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6">Anexos</Typography>
          <List>
            {taskType.taskTypeAttachments.map((attachment) => (
              <ListItem key={attachment.idTaTyAt}>
                <ListItemText primary={attachment.fileName} />
                <IconButton
                  onClick={() => handleDownload(attachment.url, attachment.fileName)}
                >
                  <DownloadIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Campos da tarefa
        </Typography>
        <DynamicForm
          fields={
            taskType.taskTypeOptions?.map((option: TaskTypeOptionDto) => ({
              id: option.idTaTyOp,
              name: option.name,
              type: option.idOpTy,
              required: option.isMandatory,
            })) || []
          }
          values={{}}
          onChange={() => {}}
        />
      </Paper>
    </Box>
  );
};

export default FillForm;