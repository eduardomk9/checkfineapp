import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Alert,
  Link,
} from '@mui/material';
import { Email, Lock } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || 'Erro ao fazer login. Verifique suas credenciais.');
      } else {
        setError('Erro ao fazer login. Verifique suas credenciais.');
      }
    }
  };

  return (
    <Box
      sx={{
        width: '100vw', // Garante que ocupe toda a largura da tela
        height: '100vh', // Garante que ocupe toda a altura da tela
        display: 'flex', // Usa flexbox pra centralizar
        justifyContent: 'center', // Centraliza horizontalmente
        alignItems: 'center', // Centraliza verticalmente
        bgcolor: 'white', // Fundo branco em toda a tela
        p: 0, // Sem padding no Box externo
        m: 0, // Sem margens no Box externo
      }}
    >
      <Box
        sx={{
          p: 3, // Padding interno da caixa de login
          bgcolor: 'white', // Fundo branco (redundante, mas mantido por clareza)
          borderRadius: 1, // Bordas arredondadas
          boxShadow: 2, // Sombra pra dar destaque
          width: { xs: '90%', sm: '400px' }, // 90% em mobile, 400px em desktop
          maxWidth: '400px', // Largura máxima da caixa de login
          minWidth: '280px', // Largura mínima pra não quebrar em telas pequenas
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, mb: 2 }}
          >
            Login
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Link href="#" variant="body2" underline="hover">
              Forgot password?
            </Link>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default Login;