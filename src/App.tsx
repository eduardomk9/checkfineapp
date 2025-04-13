import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Layout from './components/Layout';
import { useAuth } from './hooks/useAuth';
import { hasRouteAccess } from './utils/permissions';
import TaskAdminPage from './pages/TaskAdminPage';
import TreeAdminPage from './pages/TreeAdminPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const userProfiles = user?.memberOf.map((m) => m.name) || [];

  // Se não estiver logado, redireciona pro login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  // Verifica se o perfil tem acesso à rota atual
  const hasAccess = hasRouteAccess(location.pathname, userProfiles);
  if (!hasAccess) {
    return <Navigate to="/dashboard" />; // Redireciona pro dashboard se não tiver acesso
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="cadastrar-tarefa" element={<TaskAdminPage />} />
            <Route path="gerenciar-arvores" element={<TreeAdminPage />} /> 
            <Route path="dashboard" element={<div>dashboard (em construção)</div>} />
            <Route path="users" element={<div>Usuários (em construção)</div>} />
            <Route path="settings" element={<div>Configurações (em construção)</div>} />
            <Route path="" element={<Navigate to="/dashboard" />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;