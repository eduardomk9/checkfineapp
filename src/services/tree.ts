import api from './api';
import { BranchDto, TreeDto } from './types';

export const getTrees = async (token: string): Promise<TreeDto[]> => {
    const response = await api.get<TreeDto[]>('/tree/get-trees', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };

  export const getTreeById = async (token: string, idTree: number): Promise<TreeDto> => {
    const response = await api.get<TreeDto>(`/tree?id=${idTree}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };

export const createTree = async (token: string, treeDto: TreeDto): Promise<TreeDto> => {
  const response = await api.post<TreeDto>('/tree/create-tree', treeDto, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createBranch = async (token: string, branchDto: BranchDto): Promise<BranchDto> => {
  const response = await api.post<BranchDto>('/tree/create-branch', branchDto, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteTree = async (token: string, id: number): Promise<boolean> => {
  const response = await api.post<boolean>(`/tree/delete-tree?id=${id}`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteBranch = async (token: string, id: number): Promise<boolean> => {
  const response = await api.post<boolean>(`/tree/delete-branch?id=${id}`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateTree = async (token: string, treeDto: TreeDto): Promise<TreeDto> => {
  const response = await api.put<TreeDto>('/tree/update-tree', treeDto, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateBranch = async (token: string, branchDto: BranchDto): Promise<BranchDto> => {
  const response = await api.put<BranchDto>('/tree/update-branch', branchDto, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

