import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  Switch,
  FormControlLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { getTrees, getTreeById, createBranch, createTree, deleteTree } from "../services/tree"; // Adicionei createTree
import { TreeDto, BranchDto } from "../services/types";
import { useSnackbar } from "../contexts/SnackbarContext";

const TreeAdminPage: React.FC = () => {
  const [trees, setTrees] = useState<TreeDto[]>([]);
  const [selectedTree, setSelectedTree] = useState<TreeDto | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 10;
  const { showSnackbar } = useSnackbar();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [treeToDelete, setTreeToDelete] = useState<number | null>(null);
  const [branchDialogOpen, setBranchDialogOpen] = useState(false);
  const [isNewBranch, setIsNewBranch] = useState(true);
  const [newBranchName, setNewBranchName] = useState("");
  const [newBranchDescription, setNewBranchDescription] = useState("");
  const [parentBranchId, setParentBranchId] = useState<number | null>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  // State for editable tree details
  const [treeName, setTreeName] = useState<string>("");
  const [treeDescription, setTreeDescription] = useState<string>("");
  const [onlyFinalOptions, setOnlyFinalOptions] = useState<boolean>(false);
  const [tabulationTree, setTabulationTree] = useState<boolean>(false);
  const [conformityTree, setConformityTree] = useState<boolean>(false);

  // State for new tree dialog
  const [newTreeDialogOpen, setNewTreeDialogOpen] = useState(false);
  const [newTreeName, setNewTreeName] = useState<string>("");
  const [newTreeDescription, setNewTreeDescription] = useState<string>("");
  const [newOnlyFinalOptions, setNewOnlyFinalOptions] = useState<boolean>(false);
  const [newTabulationTree, setNewTabulationTree] = useState<boolean>(false);
  const [newConformityTree, setNewConformityTree] = useState<boolean>(false);

  useEffect(() => {
    const fetchTrees = async () => {
      const token = localStorage.getItem("accessToken") || "";
      const treeData = await getTrees(token);
      setTrees(treeData);
    };
    fetchTrees();
  }, []);

  useEffect(() => {
    if (selectedTree) {
      setTreeName(selectedTree.name);
      setTreeDescription(selectedTree.description || "");
      setOnlyFinalOptions(selectedTree.onlyFinalOptions || false);
      setTabulationTree(selectedTree.tabulationTree || false);
      setConformityTree(selectedTree.conformityTree || false);
    } else {
      setTreeName("");
      setTreeDescription("");
      setOnlyFinalOptions(false);
      setTabulationTree(false);
      setConformityTree(false);
    }
  }, [selectedTree]);

  const handleSelectTree = async (treeId: number) => {
    const token = localStorage.getItem("accessToken") || "";
    const tree = await getTreeById(token, treeId);
    setSelectedTree(tree);
  };

  const handleDeleteTree = async () => {
    if (treeToDelete === null) return;
    try {
      const token = localStorage.getItem("accessToken") || "";
      const success = await deleteTree(token, treeToDelete);
      if (success) {
        setTrees(trees.filter((tree) => tree.idTree !== treeToDelete));
        setSelectedTree(null);
        showSnackbar("Árvore deletada com sucesso!", "success");
      } else {
        showSnackbar("Erro ao deletar a árvore.", "error");
      }
    } catch (error) {
      console.error("Erro ao deletar a árvore:", error);
      showSnackbar("Erro ao deletar a árvore.", "error");
    } finally {
      setConfirmDialogOpen(false);
      setTreeToDelete(null);
    }
  };

  const handleSaveTreeDetails = async () => {
    if (!selectedTree) return;
    try {
      // Implement API call to update tree details
      const updatedTree: TreeDto = {
        ...selectedTree,
        name: treeName,
        description: treeDescription,
        onlyFinalOptions,
        tabulationTree,
        conformityTree,
      };
      setTrees(trees.map((tree) => (tree.idTree === selectedTree.idTree ? updatedTree : tree)));
      setSelectedTree(updatedTree);
      showSnackbar("Detalhes da árvore salvos com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao salvar os detalhes da árvore:", error);
      showSnackbar("Erro ao salvar os detalhes da árvore.", "error");
    }
  };

  const handleOpenConfirmDialog = (treeId: number, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setTreeToDelete(treeId);
    setConfirmDialogOpen(true);
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setTreeToDelete(null);
  };

  const filteredTrees = trees.filter(
    (tree) => tree && tree.name && tree.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedTrees = filteredTrees.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const totalPages = Math.ceil(filteredTrees.length / itemsPerPage);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleOpenNewTreeDialog = () => {
    setNewTreeDialogOpen(true); // Abre o novo diálogo de árvore
  };

  const handleCloseNewTreeDialog = () => {
    setNewTreeDialogOpen(false);
    setNewTreeName("");
    setNewTreeDescription("");
    setNewOnlyFinalOptions(false);
    setNewTabulationTree(false);
    setNewConformityTree(false);
  };

  const handleSaveNewTree = async () => {
    try {
      const token = localStorage.getItem("accessToken") || "";
      const newTree: TreeDto = {
        idTree: 0, // Será definido pelo backend
        name: newTreeName,
        description: newTreeDescription,
        onlyFinalOptions: newOnlyFinalOptions,
        tabulationTree: newTabulationTree,
        conformityTree: newConformityTree,
        isActive: true,
        branches: [],
      };
      await createTree(token, newTree);
      showSnackbar("Árvore criada com sucesso!", "success");

      // Atualizar a listagem de árvores
      const updatedTrees = await getTrees(token);
      setTrees(updatedTrees);

      handleCloseNewTreeDialog();
    } catch (error) {
      console.error("Erro ao criar a árvore:", error);
      showSnackbar("Erro ao criar a árvore.", "error");
    }
  };

  const handleOpenNewBranchDialog = () => {
    setIsNewBranch(true);
    setParentBranchId(selectedBranchId);
    setNewBranchName("");
    setNewBranchDescription("");
    setBranchDialogOpen(true);
    setMenuAnchorEl(null);
  };

  const handleOpenEditBranchDialog = () => {
    if (selectedBranchId && selectedTree) {
      const findBranch = (branches: BranchDto[]): BranchDto | undefined => {
        for (const branch of branches) {
          if (branch.idBranch === selectedBranchId) return branch;
          if (branch.childBranches) {
            const found = findBranch(branch.childBranches);
            if (found) return found;
          }
        }
        return undefined;
      };
      const branch = findBranch(selectedTree.branches);
      if (branch) {
        setIsNewBranch(false);
        setNewBranchName(branch.name);
        setNewBranchDescription(branch.description || "");
        setParentBranchId(branch.parentBranchId || null);
        setBranchDialogOpen(true);
      }
    }
    setMenuAnchorEl(null);
  };

  const handleDeleteBranch = () => {
    // Implement branch deletion logic here
    showSnackbar("Ramo deletado com sucesso!", "success");
    setMenuAnchorEl(null);
  };

  const handleSaveBranch = async () => {
    try {
      const token = localStorage.getItem("accessToken") || "";
      if (isNewBranch) {
        const branchDto: BranchDto = {
          idBranch: 0, // Será ignorado pelo backend
          idTree: selectedTree!.idTree,
          name: newBranchName,
          description: newBranchDescription,
          parentBranchId: parentBranchId || undefined,
          isActive: true,
          tags: "",
          childBranches: [],
        };
        await createBranch(token, branchDto);
        showSnackbar("Ramo criado com sucesso!", "success");
      } else {
        // Implement API call to update branch
        showSnackbar("Ramo atualizado com sucesso!", "success");
      }
      const updatedTree = await getTreeById(token, selectedTree!.idTree);
      setSelectedTree(updatedTree);
    } catch (error) {
      console.error("Erro ao salvar o ramo:", error);
      showSnackbar("Erro ao salvar o ramo.", "error");
    } finally {
      setBranchDialogOpen(false);
    }
  };

  const renderTree = (nodes: BranchDto[]) => {
    return nodes.map((node) => (
      <TreeItem key={node.idBranch} itemId={node.idBranch.toString()} label={node.name}>
        {Array.isArray(node.childBranches) && node.childBranches.length > 0
          ? renderTree(node.childBranches)
          : null}
      </TreeItem>
    ));
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
        Gerenciar Árvores
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          height: { xs: "auto", sm: "calc(100% - 48px)" },
        }}
      >
        {/* Tree List */}
        <Box sx={{ width: { xs: "100%", sm: "30%" }, minWidth: { sm: "300px" }, height: { sm: "100%" } }}>
          <Paper sx={{ p: 2, bgcolor: "#fff", height: { sm: "100%" }, overflowY: { sm: "auto" } }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}>
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
                onClick={handleOpenNewTreeDialog}
              >
                Novo
              </Button>
            </Box>
            <List>
              {paginatedTrees.map((tree) => (
                <ListItem
                  key={tree.idTree}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      onClick={(event) => handleOpenConfirmDialog(tree.idTree, event)}
                    >
                      <DeleteIcon sx={{ color: "#d32f2f" }} />
                    </IconButton>
                  }
                  onClick={() => handleSelectTree(tree.idTree)}
                  sx={{
                    "&:hover": { bgcolor: "#f0f0f0" },
                    cursor: "pointer",
                    bgcolor: selectedTree?.idTree === tree.idTree ? "#e0e0e0" : "transparent",
                  }}
                >
                  <ListItemText primary={tree.name} />
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
        </Box>

        {/* Tree Details and Visualization */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: { xs: "column", sm: "column" },
            gap: 2,
            height: { sm: "100%" },
            width: { xs: "100%", sm: "auto" },
          }}
        >
          {/* Tree Details */}
          <Paper sx={{ p: 2, bgcolor: "#fff", flexShrink: 0 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h5">
                {selectedTree ? "Editar Detalhes da Árvore" : "Selecione uma árvore"}
              </Typography>
              {selectedTree && (
                <Button variant="contained" size="small" onClick={handleSaveTreeDetails}>
                  Salvar
                </Button>
              )}
            </Box>
            {selectedTree && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="Nome"
                  variant="outlined"
                  fullWidth
                  value={treeName}
                  onChange={(e) => setTreeName(e.target.value)}
                />
                <TextField
                  label="Descrição"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={3}
                  value={treeDescription}
                  onChange={(e) => setTreeDescription(e.target.value)}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={onlyFinalOptions}
                      onChange={(e) => setOnlyFinalOptions(e.target.checked)}
                    />
                  }
                  label="Apenas Opções Finais"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={tabulationTree}
                      onChange={(e) => setTabulationTree(e.target.checked)}
                    />
                  }
                  label="Árvore de Tabulação"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={conformityTree}
                      onChange={(e) => setConformityTree(e.target.checked)}
                    />
                  }
                  label="Árvore de Conformidade"
                />
              </Box>
            )}
          </Paper>

          {/* Tree Visualization */}
          <Paper sx={{ p: 2, bgcolor: "#fff", flexGrow: { sm: 1 }, overflowY: { sm: "auto" }, height: { xs: "400px", sm: "auto" } }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h6">Visualização da Árvore</Typography>
              {selectedTree && (
                <Box>
                  <IconButton onClick={(e) => setMenuAnchorEl(e.currentTarget)}>
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={menuAnchorEl}
                    open={Boolean(menuAnchorEl)}
                    onClose={() => setMenuAnchorEl(null)}
                  >
                    <MenuItem onClick={handleOpenNewTreeDialog}>Novo Raiz</MenuItem>
                    <MenuItem onClick={handleOpenNewBranchDialog} disabled={!selectedBranchId}>
                      Novo Ramo
                    </MenuItem>
                    <MenuItem onClick={handleOpenEditBranchDialog} disabled={!selectedBranchId}>
                      Editar
                    </MenuItem>
                    <MenuItem onClick={handleDeleteBranch} disabled={!selectedBranchId}>
                      Excluir
                    </MenuItem>
                  </Menu>
                </Box>
              )}
            </Box>
            {selectedTree && (
              <TreeView
                slots={{
                  collapseIcon: ExpandMoreIcon,
                  expandIcon: ChevronRightIcon,
                }}
                onSelect={(event: React.MouseEvent<HTMLUListElement>) => {
                  const nodeId = (event.target as HTMLElement).getAttribute('data-nodeid');
                  if (nodeId) {
                    setSelectedBranchId(Number(nodeId));
                  }
                }}
              >
                {renderTree(selectedTree.branches)}
              </TreeView>
            )}
          </Paper>
        </Box>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onClose={handleCloseConfirmDialog}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza de que deseja excluir esta árvore? Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>Não</Button>
          <Button onClick={handleDeleteTree} color="error">Sim</Button>
        </DialogActions>
      </Dialog>

      {/* New Tree Dialog */}
      <Dialog open={newTreeDialogOpen} onClose={handleCloseNewTreeDialog}>
        <DialogTitle>Nova Árvore</DialogTitle>
        <DialogContent>
          <TextField
            label="Nome"
            variant="outlined"
            fullWidth
            value={newTreeName}
            onChange={(e) => setNewTreeName(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            label="Descrição"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            value={newTreeDescription}
            onChange={(e) => setNewTreeDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={newOnlyFinalOptions}
                onChange={(e) => setNewOnlyFinalOptions(e.target.checked)}
              />
            }
            label="Apenas Opções Finais"
          />
          <FormControlLabel
            control={
              <Switch
                checked={newTabulationTree}
                onChange={(e) => setNewTabulationTree(e.target.checked)}
              />
            }
            label="Árvore de Tabulação"
          />
          <FormControlLabel
            control={
              <Switch
                checked={newConformityTree}
                onChange={(e) => setNewConformityTree(e.target.checked)}
              />
            }
            label="Árvore de Conformidade"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewTreeDialog}>Cancelar</Button>
          <Button onClick={handleSaveNewTree} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* New/Edit Branch Dialog */}
      <Dialog open={branchDialogOpen} onClose={() => setBranchDialogOpen(false)}>
        <DialogTitle>{isNewBranch ? "Novo Ramo" : "Editar Ramo"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Nome"
            variant="outlined"
            fullWidth
            value={newBranchName}
            onChange={(e) => setNewBranchName(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            label="Descrição"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            value={newBranchDescription}
            onChange={(e) => setNewBranchDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
          {parentBranchId && (
            <Typography>Parent Branch ID: {parentBranchId}</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBranchDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleSaveBranch} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TreeAdminPage;