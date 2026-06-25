import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddJob from './pages/AddJob';
import EditJob from './pages/editJob';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      {/* Pembungkus utama dengan latar belakang gelap total khas Tailwind v4 */}
      <div className="min-h-screen bg-slate-900 text-slate-100 antialiased flex flex-col justify-center">
        <Routes>
          
          <Route element={<PublicRoute />}>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Route>
          
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="/add-job" element={<AddJob />} />
            <Route path="/edit-job/:id" element={<EditJob />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;