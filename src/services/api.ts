import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.15.4:5253',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor pra adicionar o token nas requisições, se existir
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;