import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Paper,
  Select,
  MenuItem,
  Switch,
  List,
  ListItem,
  ListItemText,
  Autocomplete,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDropzone } from "react-dropzone";
import { getOptionTypes, createTaskType, updateTaskType } from "../services/taskType";
import {
  OptionType,
  TaskTypeOptionDto,
  CreateTaskRequest,
  TaskTypeDto,
  TaskTypeAttachmentDto,
  TreeDto,
} from "../services/types";
import { useSnackbar } from "../contexts/SnackbarContext";
import { getTrees } from "../services/tree";

interface TaskFormProps {
  taskId: string | null;
  tasks: TaskTypeDto[];
  onSave: () => void;
}


const TaskForm: React.FC<TaskFormProps> = ({ taskId, tasks, onSave }) => {
  const { showSnackbar } = useSnackbar();
  const isNew = taskId === null;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [newAttachments, setNewAttachments] = useState<File[]>([]);
  const [existingAttachments, setExistingAttachments] = useState<TaskTypeAttachmentDto[]>([]);
  const [requirements, setRequirements] = useState<TaskTypeOptionDto[]>([]);
  const [optionTypes, setOptionTypes] = useState<OptionType[]>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [errors, setErrors] = useState<{ title: boolean; description: boolean }>({
    title: false,
    description: false,
  });
  const [trees, setTrees] = useState<TreeDto[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken") || "";
        const [optionTypesData, treesData] = await Promise.all([
          getOptionTypes(token),
          getTrees(token),
        ]);
        setOptionTypes(optionTypesData);
        setTrees(treesData);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!isNew) {
      const task = tasks.find((t) => t.idTaTy === Number(taskId));
      if (task) {
        setTitle(task.title);
        setDescription(task.description || "");
        setRequirements(task.taskTypeOptions || []);
        setExistingAttachments(task.taskTypeAttachments || []);
      }
    }
  }, [taskId, tasks, isNew]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [], "application/pdf": [] },
    multiple: true,
    onDrop: (acceptedFiles) => {
      setNewAttachments((prev) => [...prev, ...acceptedFiles]);
    },
  });

  const handleRemoveNewAttachment = (index: number) => {
    setNewAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingAttachment = (idTaTyAt: number) => {
    setExistingAttachments((prev) =>
      prev.filter((att) => att.idTaTyAt !== idTaTyAt)
    );
  };

  const handleAddRequirement = () => {
    const newId = Math.max(0, ...requirements.map((r) => r.idTaTyOp)) + 1;
    setRequirements((prev) => [
      ...prev,
      {
        idTaTyOp: newId,
        idTaTy: isNew ? 0 : Number(taskId),
        name: "",
        idOpTy: optionTypes[0]?.idOpTy || 1,
        isMandatory: false,
        idTree: undefined, // Inicializa como undefined
      },
    ]);
  };

  const handleDeleteRequirement = () => {
    setRequirements((prev) =>
      prev.filter((req) => !selectedRows.includes(req.idTaTyOp))
    );
    setSelectedRows([]);
  };

  const handleRequirementChange = (
    id: number,
    field: keyof TaskTypeOptionDto,
    value: string | number | boolean | undefined
  ) => {
    setRequirements((prev) =>
      prev.map((req) =>
        req.idTaTyOp === id ? { ...req, [field]: value } : req
      )
    );
  };

  const handleSave = async () => {
    const hasErrors = !title.trim() || !description.trim();
    setErrors({
      title: !title.trim(),
      description: !description.trim(),
    });
    if (hasErrors) return;

    const token = localStorage.getItem("accessToken") || "";

    console.log("Requirements antes de salvar:", requirements); // Debug

    try {
      if (isNew) {
        const createTaskRequest: CreateTaskRequest = {
          title,
          description,
          attachments: newAttachments,
          taskTypeOptions: requirements.map((req) => ({
            name: req.name,
            idOpTy: req.idOpTy,
            idTree: req.idTree, // Pode ser undefined
            isMandatory: req.isMandatory,
          })),
        };
        await createTaskType(token, createTaskRequest);
      } else {
        const formData = new FormData();
        formData.append("idTaTy", taskId!);
        formData.append("title", title);
        formData.append("description", description);
        newAttachments.forEach((file) =>
          formData.append("newAttachments", file)
        );
        existingAttachments.forEach((att, index) => {
          formData.append(
            `taskTypeAttachments[${index}][idTaTyAt]`,
            att.idTaTyAt.toString()
          );
          formData.append(
            `taskTypeAttachments[${index}][idTaTy]`,
            att.idTaTy.toString()
          );
          formData.append(
            `taskTypeAttachments[${index}][url]`,
            att.url
          );
          formData.append(
            `taskTypeAttachments[${index}][fileName]`,
            att.fileName
          );
        });
        requirements.forEach((req, index) => {
          formData.append(
            `taskTypeOptions[${index}][idTaTyOp]`,
            req.idTaTyOp.toString()
          );
          formData.append(
            `taskTypeOptions[${index}][idTaTy]`,
            taskId!
          );
          formData.append(
            `taskTypeOptions[${index}][name]`,
            req.name
          );
          formData.append(
            `taskTypeOptions[${index}][idOpTy]`,
            req.idOpTy.toString()
          );
          formData.append(
            `taskTypeOptions[${index}][isMandatory]`,
            req.isMandatory.toString()
          );
          // Só adiciona idTree se for um número válido
          if (req.idTree != null && req.idTree !== 0) {
            console.log(`Adicionando idTree [${index}]: ${req.idTree}`); // Debug
            formData.append(
              `taskTypeOptions[${index}][idTree]`,
              req.idTree.toString()
            );
          } else {
            console.log(`idTree não adicionado [${index}]: ${req.idTree}`); // Debug
          }
        });
        await updateTaskType(token, formData);
      }
      onSave();
    } catch (error) {
      console.error("Erro ao salvar a tarefa:", error);
      showSnackbar("Erro ao salvar a tarefa", "error");
    }
  };

  return (
    <Box sx={{ p: 2, backgroundColor: "white" }}>
      <Typography variant="h4" gutterBottom>
        {isNew ? "Nova Tarefa" : "Editar Tarefa"}
      </Typography>

      <TextField
        label="Título"
        variant="outlined"
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={errors.title}
        helperText={errors.title ? "O título é obrigatório." : ""}
        sx={{ mb: 2 }}
      />

      <TextField
        label="Descrição"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        error={errors.description}
        helperText={errors.description ? "A descrição é obrigatória." : ""}
        sx={{ mb: 2 }}
      />

      <Paper
        {...getRootProps()}
        sx={{
          border: "2px dashed #ccc",
          p: 2,
          textAlign: "center",
          mb: 2,
          cursor: "pointer",
          "&:hover": { borderColor: "#1976d2" },
        }}
      >
        <input {...getInputProps()} />
        <Typography>Arraste ou clique para adicionar anexos</Typography>
      </Paper>

      {(newAttachments.length > 0 || existingAttachments.length > 0) && (
        <List sx={{ mb: 2 }}>
          {existingAttachments.map((att) => (
            <ListItem
              key={att.idTaTyAt}
              sx={{ backgroundColor: "#f5f5f5", mb: 1, borderRadius: 1 }}
              secondaryAction={
                <IconButton
                  edge="end"
                  onClick={() => handleRemoveExistingAttachment(att.idTaTyAt)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={att.fileName}
                primaryTypographyProps={{ style: { color: "#333" } }}
              />
            </ListItem>
          ))}
          {newAttachments.map((file, index) => (
            <ListItem
              key={`new-${index}`}
              sx={{ backgroundColor: "#f5f5f5", mb: 1, borderRadius: 1 }}
              secondaryAction={
                <IconButton
                  edge="end"
                  onClick={() => handleRemoveNewAttachment(index)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={file.name}
                primaryTypographyProps={{ style: { color: "#333" } }}
              />
            </ListItem>
          ))}
        </List>
      )}

      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6">Requerimentos</Typography>
          <Box>
            <Button variant="text" onClick={handleAddRequirement}>
              Novo
            </Button>
            <IconButton
              onClick={handleDeleteRequirement}
              disabled={selectedRows.length === 0}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>

        {requirements.map((req) => (
          <Box key={req.idTaTyOp} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <TextField
              label="Nome"
              variant="outlined"
              size="small"
              value={req.name}
              onChange={(e) =>
                handleRequirementChange(req.idTaTyOp, "name", e.target.value)
              }
              sx={{ mr: 1, flex: 1 }}
            />

            <Select
              value={req.idOpTy}
              onChange={(e) => {
                handleRequirementChange(
                  req.idTaTyOp,
                  "idOpTy",
                  e.target.value as number
                );
                // Limpar idTree se idOpTy mudar para algo diferente de 1
                if (e.target.value !== 1) {
                  handleRequirementChange(req.idTaTyOp, "idTree", undefined);
                }
              }}
              variant="outlined"
              size="small"
              sx={{ mr: 1, flex: 1 }}
            >
              {optionTypes.map((opt) => (
                <MenuItem key={opt.idOpTy} value={opt.idOpTy}>
                  {opt.description}
                </MenuItem>
              ))}
            </Select>

            {req.idOpTy === 1 && (
              <Box sx={{ flex: 1, mr: 1 }}>
                <Autocomplete
                  options={trees}
                  getOptionLabel={(tree) => tree.name || ""}
                  isOptionEqualToValue={(a, b) => a.idTree === b.idTree}
                  value={trees.find((t) => t.idTree === req.idTree) || null}
                  onChange={(_, value) => {
                    const newIdTree = value ? value.idTree : undefined;
                    console.log(`Selecionado idTree para req ${req.idTaTyOp}: ${newIdTree}`); // Debug
                    handleRequirementChange(req.idTaTyOp, "idTree", newIdTree);
                  }}
                  size="small"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Selecione uma árvore"
                      variant="outlined"
                      error={false}
                    />
                  )}
                />
              </Box>
            )}

            <Switch
              checked={req.isMandatory}
              onChange={(e) =>
                handleRequirementChange(
                  req.idTaTyOp,
                  "isMandatory",
                  e.target.checked
                )
              }
            />

            <input
              type="checkbox"
              checked={selectedRows.includes(req.idTaTyOp)}
              onChange={(e) =>
                setSelectedRows((prev) =>
                  e.target.checked
                    ? [...prev, req.idTaTyOp]
                    : prev.filter((id) => id !== req.idTaTyOp)
                )
              }
            />
          </Box>
        ))}
      </Paper>

      <Button variant="contained" onClick={handleSave} sx={{ mt: 2 }}>
        {isNew ? "Criar" : "Salvar"}
      </Button>
    </Box>
  );
};

export default TaskForm;