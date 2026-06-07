import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900 transition-colors duration-300">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-950 shadow-xl rounded-3xl border border-gray-100 dark:border-slate-800/80 p-8 md:p-12 w-full max-w-2xl text-center transition-all duration-300">
          <div className="inline-flex bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 p-4 rounded-2xl mb-6">
            <i className="bi bi-card-text text-3xl"></i>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white mb-4 tracking-tight">
            Selamat Datang di SIM <span className="text-indigo-600 dark:text-indigo-400">Booking</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg mb-8 max-w-lg mx-auto">
            Aplikasi reservasi online untuk pengurusan SIM secara mudah, cepat, dan efisien tanpa perlu antre lama.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/reservasi')}
              className="px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 transform active:scale-[0.98]"
            >
              Mulai Reservasi Baru
            </button>
            <button
              onClick={() => navigate('/resume-antrian')}
              className="px-8 py-3.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all transform active:scale-[0.98]"
            >
              Cek Status Antrian
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
