import React, { useState, useEffect } from "react";
import {
  Tabs,
  Tab,
  Box,
  Typography,
  Button,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  TextField,
  Pagination,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TaskForm from "./TaskForm";
import FillForm from "./FillForm";
import { getTaskTypes, deleteTaskType } from "../services/taskType";
import { TaskTypeDto } from "../services/types";
import { useSnackbar } from "../contexts/SnackbarContext";

const TaskAdminPage: React.FC = () => {
  const [tasks, setTasks] = useState<TaskTypeDto[]>([]);
  const [openTabs, setOpenTabs] = useState<{ id: string; isNew: boolean }[]>([]);
  const [activeTab, setActiveTab] = useState<string>("list");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 10;
  const [openFillForm, setOpenFillForm] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const { showSnackbar } = useSnackbar();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("accessToken") || "";
      const taskTypes = await getTaskTypes(token);
      setTasks(taskTypes);
    };

    fetchTasks();
  }, []);

  const handleOpenNewTab = () => {
    if (!openTabs.some((tab) => tab.isNew)) {
      const newTabId = "novo";
      setOpenTabs([...openTabs, { id: newTabId, isNew: true }]);
      setActiveTab(newTabId);
    }
  };

  const handleOpenTaskTab = (taskId: string) => {
    if (!openTabs.some((tab) => tab.id === taskId)) {
      setOpenTabs([...openTabs, { id: taskId, isNew: false }]);
      setActiveTab(taskId);
    }
  };

  const handleCloseTab = (tabId: string) => {
    setOpenTabs(openTabs.filter((tab) => tab.id !== tabId));
    if (activeTab === tabId) setActiveTab("list");
  };

  const handleTaskSaved = async () => {
    try {
      const token = localStorage.getItem("accessToken") || "";
      const updatedTasks = await getTaskTypes(token);
      setTasks(updatedTasks);
      showSnackbar("Tarefa salva com sucesso!", "success");
      // Opcional: fechar a aba após salvar
      const currentTab = openTabs.find((tab) => tab.id === activeTab);
      if (currentTab) handleCloseTab(currentTab.id);
    } catch (error) {
      console.error("Erro ao buscar tarefas atualizadas:", error);
      showSnackbar("Erro ao atualizar a lista de tarefas", "error");
    }
  };

  const handleDeleteTask = async () => {
    if (taskToDelete === null) return;
    try {
      const token = localStorage.getItem("accessToken") || "";
      const success = await deleteTaskType(token, taskToDelete);
      if (success) {
        setTasks(tasks.filter((task) => task.idTaTy !== taskToDelete));
        handleCloseTab(taskToDelete.toString());
        showSnackbar("Tarefa deletada com sucesso!", "success");
      } else {
        showSnackbar("Erro ao deletar a tarefa.", "error");
      }
    } catch (error) {
      console.error("Erro ao deletar a tarefa:", error);
      showSnackbar("Erro ao deletar a tarefa.", "error");
    } finally {
      setConfirmDialogOpen(false);
      setTaskToDelete(null);
    }
  };

  const handleOpenConfirmDialog = (taskId: number, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setTaskToDelete(taskId);
    setConfirmDialogOpen(true);
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setTaskToDelete(null);
  };

  const handleOpenFillForm = (taskId: number) => {
    setSelectedTaskId(taskId);
    setOpenFillForm(true);
  };

  const handleCloseFillForm = () => {
    setOpenFillForm(false);
    setSelectedTaskId(null);
  };

  const filteredTasks = tasks.filter((task) =>
    `${task.title} ${task.description || ""}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const paginatedTasks = filteredTasks.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: { xs: 0, sm: 3 },
        bgcolor: "#f5f5f5",
        width: { xs: "100vw", sm: "70vw" },
        minHeight: { xs: "auto", sm: "70vh" },
        overflow: "hidden",
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ color: "#333" }}>
        Gerenciar Tarefas
      </Typography>

      <Box sx={{ width: "100%", maxWidth: "100vw", overflowX: "auto" }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: "1px solid #ddd",
            "& .MuiTabs-scroller": { overflowX: "auto !important" },
            "& .MuiTab-root": {
              minWidth: { xs: "80px", sm: "120px" },
              padding: { xs: "6px 8px", sm: "12px 16px" },
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              whiteSpace: "nowrap",
            },
          }}
        >
          <Tab label="Lista de Tarefas" value="list" />
          {openTabs.map((tab) => (
            <Tab
              key={tab.id}
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography sx={{ maxWidth: "100vw" }}>
                    {tab.isNew ? "Nova Tarefa" : `Tarefa ${tab.id}`}
                  </Typography>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCloseTab(tab.id);
                    }}
                    style={closeIconStyle}
                  >
                    <CloseIcon fontSize="small" />
                  </span>
                </Box>
              }
              value={tab.id}
            />
          ))}
        </Tabs>
      </Box>

      {activeTab === "list" && (
        <Paper
          sx={{
            p: { xs: 0, sm: 2 },
            mt: 2,
            bgcolor: "#fff",
            minHeight: { xs: "100vw", sm: "50vh" },
            width: { xs: "100%", sm: "98%" },
            maxHeight: "100%",
            maxWidth: "100%",
            overflowY: "auto",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: "100%",
              display: "flex",
              alignItems: "center",
              mb: 2,
              gap:2,
            }}
          >
            <TextField
              label="Pesquisar"
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              sx={{ flexGrow: 1 }}
            />
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={handleOpenNewTab}
            >
              Novo
            </Button>
          </Box>

          <List>
            {paginatedTasks.map((task) => (
              <ListItem
                key={task.idTaTy}
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={(event) => handleOpenConfirmDialog(task.idTaTy, event)}
                  >
                    <DeleteIcon sx={{ color: "#d32f2f" }} />
                  </IconButton>
                }
                onClick={() => handleOpenTaskTab(task.idTaTy.toString())}
                sx={{ "&:hover": { bgcolor: "#f0f0f0" }, cursor: "pointer" }}
              >
                <IconButton
                  edge="start"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleOpenFillForm(task.idTaTy);
                  }}
                  sx={{ mr: 2 }}
                >
                  <VisibilityIcon />
                </IconButton>
                <ListItemText
                  primary={task.title}
                  secondary={
                    task.description?.slice(0, 30) +
                    (task.description && task.description.length > 30 ? "..." : "")
                  }
                />
              </ListItem>
            ))}
          </List>

          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </Paper>
      )}

      {openTabs.map((tab) => (
        <Box
          key={tab.id}
          sx={{ display: activeTab === tab.id ? "block" : "none", mt: 2 }}
        >
          <TaskForm
            taskId={tab.isNew ? null : tab.id}
            tasks={tasks}
            onSave={handleTaskSaved}
          />
        </Box>
      ))}

      <Dialog open={openFillForm} onClose={handleCloseFillForm} fullWidth maxWidth="md">
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          Pré Visualizar Tarefa
          <IconButton onClick={handleCloseFillForm} edge="end">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedTaskId && <FillForm taskId={selectedTaskId} />}
        </DialogContent>
      </Dialog>

      <Dialog
        open={confirmDialogOpen}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography id="confirm-dialog-description">
            Tem certeza de que deseja excluir esta tarefa? Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Não
          </Button>
          <Button onClick={handleDeleteTask} color="error" autoFocus>
            Sim
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
};

const closeIconStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "24px",
  height: "24px",
  marginLeft: "8px",
  cursor: "pointer",
  "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.1)", borderRadius: "50%" },
};

export default TaskAdminPage;