import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  
  // Jika tidak ada token, tendang user kembali ke halaman login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Jika ada token, izinkan akses dan tampilkan halaman yang dituju
  return <Outlet />;
};

export const PublicRoute = () => {
  const token = localStorage.getItem('token');
  
  // Jika user SUDAH login tapi mencoba akses login/register, lempar ke dashboard
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};