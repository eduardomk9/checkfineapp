import React from "react";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { BranchDto } from "../services/types";

interface SelectTableTreeViewProps {
  nodes: BranchDto[] | undefined;
  onSelectBranch: (branchId: number) => void;
}

const SelectTableTreeView: React.FC<SelectTableTreeViewProps> = ({
  nodes,
  onSelectBranch,
}) => {
  const renderTree = (branches: BranchDto[]) => {
    return branches.map((node) => (
      <TreeItem
        key={node.idBranch}
        itemId={node.idBranch.toString()}
        label={node.name}
        onClick={() => onSelectBranch(node.idBranch)}
      >
        {Array.isArray(node.childBranches) && node.childBranches.length > 0
          ? renderTree(node.childBranches)
          : null}
      </TreeItem>
    ));
  };

  return (
    <SimpleTreeView
      slots={{
        collapseIcon: ExpandMoreIcon,
        expandIcon: ChevronRightIcon,
      }}
    >
      {nodes && nodes.length > 0 ? renderTree(nodes) : null}
    </SimpleTreeView>
  );
};

export default SelectTableTreeView;