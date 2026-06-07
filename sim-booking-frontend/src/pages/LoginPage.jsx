import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { ToastTypes } from '../constants/toastTypes';

const LoginPage = ({ showToast }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    // Ensure root matches the saved theme on mount
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    
    if (!email || !password) {
      showToast('Harap isi email dan password!', ToastTypes.danger);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('/login', { email, password });
      const { access_token, user } = response.data;

      // Store in localStorage
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));

      showToast(`Selamat datang kembali, ${user.name}!`, 'success');

      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/viewer-landing');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Login error details:', err.response?.data || err.message);
      const errorMsg = err.response?.data?.message || 'Login gagal, email atau password salah!';
      showToast(errorMsg, ToastTypes.danger);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (roleType) => {
    let quickEmail = '';
    let quickPassword = 'password';

    if (roleType === 'admin') {
      quickEmail = 'admin@example.com';
    } else {
      quickEmail = 'customer@example.com';
    }

    setEmail(quickEmail);
    setPassword(quickPassword);

    // Give state updates a split millisecond to propagate before calling submit
    setTimeout(() => {
      setIsLoading(true);
      axios.post('/login', { email: quickEmail, password: quickPassword })
        .then((response) => {
          const { access_token, user } = response.data;
          localStorage.setItem('token', access_token);
          localStorage.setItem('user', JSON.stringify(user));
          showToast(`Selamat datang kembali, ${user.name}!`, 'success');
          if (user.role === 'admin') {
            navigate('/viewer-landing');
          } else {
            navigate('/');
          }
        })
        .catch((err) => {
          const errorMsg = err.response?.data?.message || 'Login gagal!';
          showToast(errorMsg, ToastTypes.danger);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, 100);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-slate-50 via-indigo-50 to-slate-100 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900 px-4 relative overflow-hidden transition-colors duration-300">
      
      {/* Floating Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={toggleTheme}
          className="p-2.5 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md"
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? (
            <i className="bi bi-moon-fill"></i>
          ) : (
            <i className="bi bi-sun-fill text-amber-400"></i>
          )}
        </button>
      </div>

      {/* Background Decorative Circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse duration-3000"></div>

      {/* Main Container */}
      <div className="w-full max-w-lg z-10">
        
        {/* Logo/Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex bg-gradient-to-tr from-indigo-500 to-purple-600 p-3 rounded-2xl text-white font-bold shadow-lg shadow-indigo-500/20 mb-3 transform hover:scale-105 transition-transform duration-300">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            SIM<span className="text-indigo-600 dark:text-indigo-400">Booking</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Sistem Layanan Reservasi & Pelayanan SIM Keliling</p>
        </div>

        {/* Card */}
        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200/80 dark:border-slate-800 rounded-3xl shadow-xl dark:shadow-2xl p-8 md:p-10 transition-all duration-300">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 text-center">Masuk ke Akun Anda</h2>
          
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500">
                  <i className="bi bi-envelope-fill"></i>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-950/80 border border-gray-300 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Password</label>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500">
                  <i className="bi bi-lock-fill"></i>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-white dark:bg-slate-950/80 border border-gray-300 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-semibold transition-all duration-300 transform active:scale-[0.98] shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 mt-4 text-sm disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <span>Masuk</span>
                  <i className="bi bi-arrow-right-short text-lg"></i>
                </>
              )}
            </button>
          </form>

          {/* Quick Login Section */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-slate-800/80">
            <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">Akses Cepat Demo (Pilih Role)</p>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Customer Access */}
              <button
                onClick={() => handleQuickLogin('customer')}
                type="button"
                className="flex flex-col items-center justify-center p-3.5 bg-slate-50 dark:bg-slate-950/40 hover:bg-slate-100 dark:hover:bg-slate-950/80 border border-gray-200/80 dark:border-slate-800/60 hover:border-indigo-400 dark:hover:border-indigo-500/50 rounded-2xl transition-all group text-center"
              >
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <i className="bi bi-people-fill text-lg"></i>
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Customer</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Pemohon SIM</span>
              </button>

              {/* Admin Access */}
              <button
                onClick={() => handleQuickLogin('admin')}
                type="button"
                className="flex flex-col items-center justify-center p-3.5 bg-slate-50 dark:bg-slate-950/40 hover:bg-slate-100 dark:hover:bg-slate-950/80 border border-gray-200/80 dark:border-slate-800/60 hover:border-amber-500/50 rounded-2xl transition-all group text-center"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <i className="bi bi-shield-fill text-lg"></i>
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Admin</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Petugas Pelayanan</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
