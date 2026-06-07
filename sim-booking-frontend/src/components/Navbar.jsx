import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';

const Navbar = ({ showToast }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = async () => {
    try {
      // Send logout request to backend
      await axios.post('/logout');
    } catch (error) {
      console.error('Backend logout failed or token already invalid', error);
    } finally {
      // Always clear local storage and redirect to login page
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('lokasi');
      localStorage.removeItem('showFullForm');
      
      if (showToast) {
        showToast('Logout berhasil!', 'success');
      }
      navigate('/login');
    }
  };

  return (
    <nav className="bg-white dark:bg-slate-950 border-b border-gray-100 dark:border-slate-800/80 shadow-sm sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 no-underline">
              <div className="bg-indigo-600 p-2 rounded-lg text-white font-bold flex items-center justify-center shadow-md shadow-indigo-200 dark:shadow-none">
                <i className="bi bi-shield-lock-fill text-lg"></i>
              </div>
              <span className="text-xl font-bold tracking-tight text-indigo-900 dark:text-indigo-200 font-sans">
                SIM<span className="text-indigo-600 dark:text-indigo-400 font-normal">Booking</span>
              </span>
            </Link>
          </div>

          {/* Controls: Theme, User Profile, and Logout */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 border border-gray-200 dark:border-slate-800 text-gray-600 dark:text-slate-400 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? (
                <i className="bi bi-moon-fill text-slate-700"></i>
              ) : (
                <i className="bi bi-sun-fill text-amber-400"></i>
              )}
            </button>

            {user && user.name && (
              <div className="flex items-center gap-2 sm:gap-3 bg-gray-50 dark:bg-slate-900/60 px-2 sm:px-3 py-1.5 rounded-full border border-gray-100 dark:border-slate-800/80">
                {/* Avatar Initial */}
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold shadow-sm text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                
                {/* Name & Role Badge */}
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-sm font-semibold text-gray-800 dark:text-slate-200 leading-tight">
                    {user.name}
                  </span>
                  <div className="flex mt-0.5">
                    {user.role === 'admin' ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50">
                        ADMIN / PETUGAS
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-100 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900/50">
                        CUSTOMER
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-gray-200 dark:border-slate-800 text-gray-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 bg-white dark:bg-slate-900 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm"
            >
              <i className="bi bi-box-arrow-right"></i>
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
