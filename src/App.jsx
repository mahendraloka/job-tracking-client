import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddJob from './pages/AddJob';
import EditJob from './pages/editJob';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import { ThemeProvider } from './components/ThemeContext';
import SharedLayout from './components/SharedLayout';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Route>
          
          <Route element={<ProtectedRoute />}>
            <Route element={<SharedLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/add-job" element={<AddJob />} />
              <Route path="/edit-job/:id" element={<EditJob />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;