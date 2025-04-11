// src/services/auth.ts
import api from './api';
import { LoginResponse } from './types';

export const login = async (mail: string, password: string): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/Login', { mail, password }); 
  return response.data;
};