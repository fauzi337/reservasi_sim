import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-300">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-xl text-center">
        <h1 className="text-4xl font-bold text-indigo-700 mb-4">
          Selamat Datang di SIM Booking
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          Aplikasi reservasi online untuk pengurusan SIM secara mudah dan efisien.
        </p>
        <button
          onClick={() => navigate('/viewer-landing')}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all">
          Mulai Reservasi
        </button>
      </div>
    </div>
  );
}
