import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { API_BASE_URL } from './config/apiConfig';

import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import AdminLogin from './components/AdminLogin';
import Profile from './components/Profilepage';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Lobby from './components/Lobby';
import TableRoom from './components/TableRoom';
import CreateTable from './components/CreateTable';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Removed profile API fetch since /api/profile endpoint was deleted
    // User authentication is now handled individually by each component
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/create-table" element={<CreateTable />} />
        <Route path="/table/:id" element={<TableRoom />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
