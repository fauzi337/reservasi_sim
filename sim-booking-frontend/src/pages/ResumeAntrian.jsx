import {
  inputClass,labelClass,radioGroupClassYes,radioGroupClassNo,grid_head,grid_1,grid_2,grid_3,grid_4,grid_5,grid_6,grid_7,grid_8,
  grid_9,grid_10,grid_11,grid_12,
} from "../styles/formClasses"; // path menyesuaikan dengan struktur proyekmu
import { useEffect, useState } from "react";
import axios from 'axios';
import { ToastTypes } from '../constants/toastTypes';
import { useLocation } from 'react-router-dom';

export default function ResumeAntrian() {
   const [today, setToday] = useState("");

   useEffect(() => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    setToday(`${yyyy}-${mm}-${dd}`);
   }, []);
  const location = useLocation();
  const { nomorAnda = "PP-2", nomorSaatIni = "PP-1", estimasi = 15 } = location.state || {};

  const steps = [
    "Pemanggilan Cek Kesehatan",
    "Pemanggilan Verifikasi barcode",
    "Pemanggilan Pembayaran",
    "Pemanggilan Antrian Ambil Foto",
    "Pemanggilan Antrian Ambil SIM",
  ];

  const status = "Belum"; // default status, bisa dinamis nantinya

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-1 text-center">Resume</h2>
        <p className="text-center text-lg text-gray-600 mb-6">PELAYANAN PUKUL 09.00</p>

        <div className="grid grid-cols-2 gap-4 mb-4 text-center">
          <div className="bg-blue-50 p-4 rounded-md">
            <div className="font-semibold">Nomor Antrian Anda</div>
            <div className="text-xl font-bold text-blue-700">{nomorAnda}</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-md">
            <div className="font-semibold">Nomor Antrian Saat Ini</div>
            <div className="text-xl font-bold text-yellow-700">{nomorSaatIni}</div>
          </div>
        </div>

        <div className="text-center text-sm mb-4">
          <span className="font-semibold">Estimasi Dilayani:</span> {estimasi} menit
          <br />
          {/* <span className="text-xs text-gray-500">
            ( a = jumlah antrian sejenis yang belum dipanggil, b = waktu layanan per orang )
          </span> */}
        </div>

        <div className="bg-gray-800 text-white px-4 py-2 rounded-t-md font-semibold">Status Pelayanan</div>
        <div className="divide-y border rounded-b-md">
          {steps.map((step, index) => (
            <div key={index} className="flex justify-between px-4 py-3 bg-white">
              <span>{index + 1}. {step}</span>
              <span className="text-blue-700 font-medium">{status}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 text-sm text-gray-600">
          <p><strong>Note Status:</strong> Belum, Dilayani, Sudah</p>
          {/* <p><strong>a</strong> = jumlah jenis antrian yg sama/hari dengan status pelayanan belum sampai antrian client</p>
          <p><strong>b</strong> = waktu pelayanan per menit</p> */}
        </div>
      </div>
    </div>
  );
}
