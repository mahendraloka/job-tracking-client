import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import api from '../utils/api';

export const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  const [isValid, setIsValid] = useState(token ? null : false);

  useEffect(() => {
    if (!token) {
      setIsValid(false);
      return;
    }

    api.get('/user')
      .then(() => {
        setIsValid(true);
      })
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_name');
        setIsValid(false);
      });
  }, [token]);

  if (isValid === null) {
    return (
      <div className="min-h-screen bg-[#121318] dark:bg-[#121318] flex items-center justify-center text-slate-400">
        <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return isValid ? <Outlet /> : <Navigate to="/login" replace />;
};

export const PublicRoute = () => {
  const token = localStorage.getItem('token');
  const [isValid, setIsValid] = useState(token ? null : false);

  useEffect(() => {
    if (!token) {
      setIsValid(false);
      return;
    }

    api.get('/user')
      .then(() => {
        setIsValid(true);
      })
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_name');
        setIsValid(false);
      });
  }, [token]);

  if (isValid === null) {
    return (
      <div className="min-h-screen bg-[#121318] dark:bg-[#121318] flex items-center justify-center text-slate-400">
        <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return isValid ? <Navigate to="/dashboard" replace /> : <Outlet />;
};