import {
  inputClass, labelClass, grid_head, grid_4
} from "../styles/formClasses";
import { useEffect, useState } from "react";
import axios from 'axios';
import { ToastTypes } from '../constants/toastTypes';
import { useLocation } from 'react-router-dom';

export default function ResumeAntrian({ showToast }) {
  const [today, setToday] = useState("");
  const [formData, setFormData] = useState({ nik: '' });

  const location = useLocation();
  // const { nomorAnda = "PP-2", nomorSaatIni = "PP-1", estimasi = 0 } = location.state || {};

  const proper = (text) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const [resumeData, setResumeData] = useState({
    nomorAnda: '',
    nomorSaatIniPP: '',
    nomorSaatIniBB: '',
    estimasi: 0,
    lokasi: 'Silahkan Masukan NIK Terlebih Dahulu !',
    status: {
      kesehatan: 'Belum',
      verifikasi: 'Belum',
      pembayaran: 'Belum',
      foto: 'Belum',
      pengambilan: 'Belum'
    },
    tglReserv: '',
  });

  const [antrianSaatIni, setAntrianData] = useState({
    nomorAnda: '',
    nomorSaatIniPP: '',
    nomorSaatIniBB: '',
    estimasi: 0
  });

  const steps = [
    { label: "Pemanggilan Cek Kesehatan", key: "kesehatan" },
    { label: "Pemanggilan Verifikasi barcode", key: "verifikasi" },
    { label: "Pemanggilan Pembayaran", key: "pembayaran" },
    { label: "Pemanggilan Antrian Ambil Foto", key: "foto" },
    { label: "Pemanggilan Antrian Ambil SIM", key: "pengambilan" }
  ];

  // const status = "Belum"; // default status

  // Set tanggal hari ini
  useEffect(() => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    setToday(`${yyyy}-${mm}-${dd}`);
  }, []);

  // Auto fetch status journey
  // useEffect(() => {
  //   const getStatusJourney = async () => {
  //     try {
  //       const res = await axios.get(`http://localhost:8000/api/get-status-journey?lokasi=${lokasi}`);
  //       console.log("Status Journey:", res.data);
  //       const pp = res.data.saatiniPP
  //       const bb = res.data.saatiniBB

  //       setAntrianData({
  //         nomorSaatIniPP: pp,
  //         nomorSaatIniBB: bb,
  //       })
  //       // setAntrianData(res.data); // Jika ada state antrian
  //     } catch (err) {
  //       console.error('Gagal mengambil data antrian:', err);
  //     }
  //   };
  //   getStatusJourney();
  // }, []);

  // ⛔ FIX: gunakan useEffect untuk mendeteksi perubahan nik panjang 16
  useEffect(() => {
    if (formData.nik.length === 16) {
      handleSubmit();
    }
  }, [formData.nik]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value.length <= 16) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post('http://localhost:8000/api/getAntrian', {
        nik: formData.nik
      });
      const data = res.data;
      const getNomor = res.data.nomoranda;
      const status = res.data.status;

      setResumeData({
        nomorAnda: getNomor, // atau sesuaikan struktur datanya
        estimasi: data.data.kebutuhan == 'PP' ? data.estimasiLayanPP : data.estimasiLayanBB, // estimasi bisa dihitung dari posisi antrian x waktu rata-rata
        lokasi: data.lokasi,
        nomorSaatIniPP: data.saatiniPP,
        nomorSaatIniBB: data.saatiniBB,
        status: {
          kesehatan: status.kesehatan == null ? 'Belum' : proper(status.kesehatan),
          verifikasi: status.verifikasi == null ? 'Belum': proper(status.verifikasi),
          pembayaran: status.pembayaran == null ? 'Belum': proper(status.pembayaran),
          foto: status.foto == null ? 'Belum': proper(status.foto),
          pengambilan: status.pengambilan == null ? 'Belum' : proper(status.pengambilan)
        },
        tglReserv: data.data.tanggal_reservasi,
      });

      // console.log("Response dari getAntrian:", res.data);
      showToast("Ambil Data Berhasil !", ToastTypes.sukses);
    } catch (err) {
      if (err.response?.status === 422) {
        const validationErrors = err.response.data.errors;
        const msg = validationErrors ? Object.values(validationErrors).flat().join(', ') : 'Validasi gagal!';
        showToast(msg, ToastTypes.danger);
      } else {
        const errorMsg = err.response?.data?.message || err.message || 'Terjadi kesalahan!';
        showToast(errorMsg, ToastTypes.danger);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-1 text-center">Resume</h2>
        <p className="text-center text-lg text-gray-600 mb-6">PELAYANAN PUKUL 09.00</p>

        <div className="grid grid-cols-2 gap-4 mb-4 text-center">
          <div className="bg-blue-50 p-4 rounded-md">
            <div className="font-semibold">Nomor Antrian Anda</div>
            <div className="text-xl font-bold text-blue-700">{resumeData.nomorAnda || "Belum tersedia"}</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-md">
            <div className="font-semibold">Nomor Antrian Saat Ini</div>
            <div className={`text-xl font-bold ${resumeData.nomorSaatIniPP == null ? 'text-yellow-700' : 'blinking text-yellow-700'}`}>{resumeData.nomorSaatIniPP || "Belum tersedia"} / {resumeData.nomorSaatIniBB || "Belum tersedia"}</div>
          </div>
        </div>

        <div className="text-sm mb-6 px-4 py-4 bg-white rounded-md shadow-md border text-gray-700">
          <div className="text-center mb-4">
            <p className="text-base">
              <span className="font-semibold">Estimasi Dilayani:</span>{' '}
              <span className="text-blue-700 font-medium">{resumeData.estimasi} menit</span>
            </p>
            <p className="text-base">
              <span className="text-xl font-bold text-red-500">Lokasi:</span>{' '}
              <span className="font-semibold">{resumeData.lokasi}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 font-medium text-gray-600">Masukan NIK</label>
              <input
                type="text"
                name="nik"
                value={formData.nik}
                onChange={handleChange}
                maxLength="16"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            {resumeData.nomorAnda && (
                <>
              <div>
                <label className="block mb-1 font-medium text-gray-600">Tgl Reservasi Anda</label>
                <div className="p-2 bg-gray-100 rounded-md">{resumeData.tglReserv}</div>
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-600">Hari ini, Tanggal:</label>
                <div className="p-2 bg-gray-100 rounded-md">{today}</div>
              </div>
              </>
              )}
          </div>
        </div>

        <div className="bg-gray-800 text-white px-4 py-2 rounded-t-md font-semibold">Status Pelayanan</div>
        <div className="divide-y border rounded-b-md">
          {steps.map((step, index) => (
            <div key={index} className="flex justify-between px-4 py-3 bg-white">
              <span>{index + 1}. {step.label}</span>
              <span
                className={`font-medium ${resumeData.status[step.key] === 'Sudah'? 'text-green-600': 
                resumeData.status[step.key] === 'Belum' ? 'text-blue-700' : 'text-yellow-600'}`}>
                {resumeData.status[step.key] ?? 'Belum'}
              </span>
            </div>
          ))}
        </div>

        <div className="text-m text-red-300">
          <p><strong>*Note:</strong> ...</p>
        </div>
      </div>
    </div>
  );
}