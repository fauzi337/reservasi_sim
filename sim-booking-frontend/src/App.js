import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BookingForm from './components/BookingForm'; // perhatikan path ini
import HomePage from './pages/HomePage';
import ReservasiPage from './pages/ReservasiPage';
import ResumeAntrian from './pages/ResumeAntrian';
import PanggilAntrian from './pages/PanggilAntrian';
import ViewerLanding from './pages/ViewerLanding';
import InputKesehatan from './pages/InputKesehatan';
import Toast from './components/Toast';
import React, { useState, useEffect  } from 'react';
import * as bootstrap from 'bootstrap';
import './styles/global.css';
window.bootstrap = bootstrap;


function App() {
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'danger',
  });

  const showToast = (message, type = 'danger') => {
    // console.log("🔥 showToast DIPANGGIL:", message, type);
    setToast({ show: true, message, type });

    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  useEffect(() => {
    setToast({ show: false, message: '', type: 'danger' });
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/reservasi" element={<ReservasiPage showToast={showToast} />} />
          <Route path="/resume-antrian" element={<ResumeAntrian showToast={showToast} />} />
          <Route path="/panggil-antrian" element={<PanggilAntrian showToast={showToast} />} />
          <Route path="/viewer-landing" element={<ViewerLanding showToast={showToast} />} />
          <Route path="/input-kesehatan" element={<InputKesehatan showToast={showToast} />} />
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
