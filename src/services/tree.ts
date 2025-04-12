import api from './api';
import { TreeDto } from './types';

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

  