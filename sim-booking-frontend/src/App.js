import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import * as bootstrap from 'bootstrap';
import './styles/global.css';

import HomePage from './pages/HomePage';
import ReservasiPage from './pages/ReservasiPage';
import ResumeAntrian from './pages/ResumeAntrian';
import PanggilAntrian from './pages/PanggilAntrian';
import ViewerLanding from './pages/ViewerLanding';
import InputKesehatan from './pages/InputKesehatan';
import InputPembayaran from './pages/InputPembayaran';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import Toast from './components/Toast';

window.bootstrap = bootstrap;

function App() {
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'danger',
  });

  const showToast = (message, type = 'danger') => {
    setToast({ show: true, message, type });

    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  useEffect(() => {
    setToast({ show: false, message: '', type: 'danger' });
    
    // Load saved theme
    const theme = localStorage.getItem('theme') || 'light';
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<LoginPage showToast={showToast} />} />

          {/* Protected Customer Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <HomePage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/reservasi"
            element={
              <ProtectedRoute allowedRoles={['customer', 'admin']}>
                <ReservasiPage showToast={showToast} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/resume-antrian"
            element={
              <ProtectedRoute allowedRoles={['customer', 'admin']}>
                <ResumeAntrian showToast={showToast} />
              </ProtectedRoute>
            }
          />

          {/* Protected Admin/Staff Routes */}
          <Route
            path="/viewer-landing"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ViewerLanding showToast={showToast} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/panggil-antrian"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <PanggilAntrian showToast={showToast} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/input-kesehatan"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <InputKesehatan showToast={showToast} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/input-pembayaran"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <InputPembayaran showToast={showToast} />
              </ProtectedRoute>
            }
          />

          {/* Fallback routing */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>

      {toast.show && toast.message && (
        <Toast
          show={toast.show}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </>
  );
}

export default App;
