import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../modules/auth/pages/LoginPage';
import RegisterPage from '../modules/auth/pages/RegisterPage';
import AuthLayout from '../layouts/AuthLayout';
import AppLayout from '../layouts/AppLayout';
import Dashboard from '../layouts/Dashboard';
import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';
const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas públicas con layout Auth */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Rutas privadas con layout App */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={ <PrivateRoute><Dashboard/></PrivateRoute>} />
      </Route>

      {/* Redirección para rutas no existentes */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;
