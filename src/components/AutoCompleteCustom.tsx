import {
  Autocomplete,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
} from "@mui/material";
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AccountTree from '@mui/icons-material/AccountTree';
import CloseIcon from '@mui/icons-material/Close';
import React, { useState } from "react";
import { BranchDto } from "../services/types";

export interface AutoCompleteCustomProps {
  title: string;
  field?: string;
  fieldId?: string;
  required?: boolean;
  error?: boolean | string | null;
  options: readonly unknown[];
  value: unknown;
  onChange: (selected: unknown) => void;
  size?: "small" | "medium";
  variant?: "filled" | "outlined" | "standard";
  startAdornment?: React.ReactNode;
  disabled?: boolean;
  getOptionDisabled?: (option: unknown) => boolean;
  treeData?: unknown;
}

const AutoCompleteCustom = (props: AutoCompleteCustomProps) => {
  const [openTreeModal, setOpenTreeModal] = useState(false);

  const options = props?.options?.map((option) => ({
    ...(typeof option === "object" && option !== null ? option : {}),
  }));

  const isOptionEqualToValue = (option: unknown, value: unknown) => {
    const optionRecord = option as Record<string, unknown>;
    return optionRecord[props.fieldId ?? "idBranch"] === value;
  };

  // Função recursiva para renderizar os nós da árvore no modal
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
    <>
      <Autocomplete
        options={options}
        getOptionLabel={(option) => {
          const optionRecord = option as Record<string, unknown>;
          return (optionRecord["path"] as string) || (optionRecord["name"] as string) || "";
        }}
        isOptionEqualToValue={isOptionEqualToValue}
        getOptionDisabled={props.getOptionDisabled}
        fullWidth
        autoHighlight
        value={options?.find((x: Record<string, unknown>) => x[props.fieldId ?? "idBranch"] === props.value) || null}
        onChange={(_event: React.SyntheticEvent<Element, Event>, newValue: unknown) => {
          const selectedValue = newValue as Record<string, unknown> | null;
          props.onChange(selectedValue ? selectedValue[props.fieldId ?? "idBranch"] : null);
        }}
        noOptionsText={"Não encontrado..."}
        renderInput={(params) => (
          <TextField
            {...params}
            required={props.required}
            variant={props.variant}
            size={props.size}
            label={props.title}
            error={!!props.error}
            helperText={props.error || ""}
            InputProps={{
              ...params.InputProps,
              startAdornment: props.startAdornment,
              endAdornment: (
                <>
                  {params.InputProps.endAdornment}
                  {props.treeData && (
                    <IconButton onClick={() => setOpenTreeModal(true)}>
                      <AccountTree />
                    </IconButton>
                  )}
                </>
              ),
            }}
          />
        )}
        disabled={props.disabled}
      />
      {props.treeData && (
        <Dialog open={openTreeModal} onClose={() => setOpenTreeModal(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              {props.title}
              <IconButton
                aria-label="close"
                onClick={() => setOpenTreeModal(false)}
                sx={{ color: (theme) => theme.palette.grey[500] }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <TreeView
              slots={{
                collapseIcon: ExpandMoreIcon,
                expandIcon: ChevronRightIcon,
              }}
              sx={{ minHeight: 240 }}
            >
              {renderTree((props.treeData as { branches: BranchDto[] }).branches)}
            </TreeView>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default AutoCompleteCustom;