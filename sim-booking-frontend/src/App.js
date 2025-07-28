import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BookingForm from './components/BookingForm'; // perhatikan path ini
import HomePage from './pages/HomePage';
import ReservasiPage from './pages/ReservasiPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/reservasi" element={<ReservasiPage />} />
      </Routes>
    </Router>
  );
}

export default App;
