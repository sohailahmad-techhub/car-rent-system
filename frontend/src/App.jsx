import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { useContext } from 'react';

// Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ManageVehicles from './pages/Admin/ManageVehicles';
import ManageBookings from './pages/Admin/ManageBookings';
import BrowseVehicles from './pages/User/BrowseVehicles';
import MyBookings from './pages/User/MyBookings';

// Components
import Navbar from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';

const App = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Navbar />
      <div className="min-h-screen bg-slate-50 pt-16">
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to={user.role === 'admin' ? '/admin' : '/vehicles'} />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to={user.role === 'admin' ? '/admin' : '/vehicles'} />} />
          
          {/* Default redirect based on role */}
          <Route path="/" element={<Navigate to={user ? (user.role === 'admin' ? '/admin' : '/vehicles') : '/login'} />} />

          {/* User Routes */}
          <Route path="/vehicles" element={<ProtectedRoute><BrowseVehicles /></ProtectedRoute>} />
          <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/vehicles" element={<ProtectedRoute adminOnly><ManageVehicles /></ProtectedRoute>} />
          <Route path="/admin/bookings" element={<ProtectedRoute adminOnly><ManageBookings /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
