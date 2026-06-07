import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useEffect, useState } from "react";
import './ViewerLanding.css';

function ViewerLanding({ showToast }) {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      
      // Time formatter
      setCurrentTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      
      // Date formatter
      setCurrentDate(now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const actionCards = [
    {
      to: "/reservasi",
      title: "Buat Reservasi",
      description: "Pendaftaran dan booking antrian baru untuk pemohon SIM.",
      icon: "bi-person-plus-fill",
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50/50",
      iconColor: "text-blue-600",
      borderColor: "hover:border-blue-300"
    },
    {
      to: "/resume-antrian",
      title: "Resume Antrian",
      description: "Lihat status perjalanan pelayanan dan monitoring data NIK.",
      icon: "bi-clipboard-data-fill",
      color: "from-cyan-500 to-blue-600",
      bgColor: "bg-cyan-50/50",
      iconColor: "text-cyan-600",
      borderColor: "hover:border-cyan-300"
    },
    {
      to: "/panggil-antrian",
      title: "Panggil Antrian",
      description: "Panggil nomor antrian aktif untuk pemeriksaan, foto, dan cetak.",
      icon: "bi-megaphone-fill",
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-50/50",
      iconColor: "text-emerald-600",
      borderColor: "hover:border-emerald-300"
    },
    {
      to: "/input-kesehatan",
      title: "Input Kesehatan",
      description: "Catat hasil pemeriksaan fisik, tensi, dan tes mata pemohon.",
      icon: "bi-heart-pulse-fill",
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-amber-50/50",
      iconColor: "text-amber-600",
      borderColor: "hover:border-amber-300"
    },
    {
      to: "/input-pembayaran",
      title: "Input Pelayanan",
      description: "Verifikasi dokumen, kelayakan berkas, dan bukti pembayaran.",
      icon: "bi-cash-coin",
      color: "from-rose-500 to-red-600",
      bgColor: "bg-rose-50/50",
      iconColor: "text-rose-600",
      borderColor: "hover:border-rose-300"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 relative overflow-hidden transition-colors duration-300">
      
      {/* Glow effects in background */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <Navbar showToast={showToast} />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 z-10 flex flex-col gap-8">
        
        {/* Dashboard Header Panel */}
        <div className="bg-white dark:bg-slate-950/60 backdrop-blur-md border border-gray-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-md dark:shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-3 border border-indigo-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Sistem Aktif - Petugas Panel
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
              Pusat Kendali Pelayanan SIM
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base mt-1.5 max-w-xl">
              Gunakan panel ini untuk mengelola reservasi, pemanggilan antrian, dan input data administrasi pemohon secara real-time.
            </p>
          </div>

          {/* Time and Date Widget */}
          <div className="bg-slate-100 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl px-5 py-4 flex flex-col items-start md:items-end justify-center min-w-[240px] transition-all duration-300">
            <span className="text-2xl font-mono font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">
              {currentTime || "00:00:00"}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold">
              {currentDate || "Loading Tanggal..."}
            </span>
          </div>
        </div>

        {/* Action Grid Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white uppercase tracking-wider">Menu Operasional</h2>
          <span className="text-xs text-slate-500">Pilih salah satu modul layanan di bawah</span>
        </div>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {actionCards.map((card, idx) => (
            <Link 
              key={idx} 
              to={card.to} 
              className={`group flex flex-col bg-white dark:bg-slate-950/40 hover:bg-slate-50 dark:hover:bg-slate-950 border border-gray-200 dark:border-slate-800/80 ${card.borderColor} rounded-2xl p-6 transition-all duration-300 transform hover:-translate-y-1.5 shadow-md hover:shadow-lg dark:shadow-lg no-underline`}
            >
              {/* Header inside Card */}
              <div className="flex justify-between items-start mb-4">
                {/* Icon Container with glowing theme */}
                <div className={`w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 flex items-center justify-center text-xl ${card.iconColor} shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                  <i className={`bi ${card.icon}`}></i>
                </div>
                {/* Micro Action indicator */}
                <div className="text-slate-400 dark:text-slate-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  <i className="bi bi-arrow-right-short text-2xl"></i>
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {card.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed flex-1">
                {card.description}
              </p>

              {/* Card Footer Decorator */}
              <div className="mt-5 pt-3 border-t border-gray-100 dark:border-slate-900 flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-semibold group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors">
                <span>Buka Aplikasi</span>
                <i className="bi bi-chevron-right text-[10px]"></i>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}

export default ViewerLanding;