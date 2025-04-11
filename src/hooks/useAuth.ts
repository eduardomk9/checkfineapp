// src/hooks/useAuth.ts
import { useCallback, useState } from 'react';
import { login as loginService } from '../services/auth';
import { LoginResponse } from '../services/types';

export const useAuth = () => {
  const [user, setUser] = useState<LoginResponse['profile'] | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = useCallback(async (email: string, password: string) => {
    const response = await loginService(email, password);
    localStorage.setItem('accessToken', response.token.accessToken);
    localStorage.setItem('user', JSON.stringify(response.profile));
    setUser(response.profile);
    return response;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  return { user, login, logout };
};