import {
  itemPosition, grid_3, grid_head_nonform, grid_4,border_head,border_detail,labelBiasa,textDisabled,boxColorLine,section_head,section_font,
  grid_2,btnManualPulse,
} from "../styles/formClasses";
import { useEffect, useState } from "react";
import axios from 'axios';
import { ToastTypes } from '../constants/toastTypes';
import { useLocation } from 'react-router-dom';

export default function InputKesehatan({ showToast }) {
  const [today, setToday] = useState("");
  const [formData, setFormData] = useState({ nik: '' });

  const location = useLocation();

  const proper = (text) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const [resumeData, setResumeData] = useState({
    nomorAnda: '',
    lokasi: '',
    tglReserv: '',
    reservasi_id: '',
    namaLengkap: '',
  });

  const [kesehatanData, setKesehatanData] = useState({
    td: '',
    tb: '',
    bb: '',
    suhu: '',
    nadi: '',
    nafas: '',
  });

  // Set tanggal hari ini
  useEffect(() => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    setToday(`${yyyy}-${mm}-${dd}`);
  }, []);

  // ⛔ FIX: gunakan useEffect untuk mendeteksi perubahan nik panjang 16
  useEffect(() => {
    if (formData.nik.length === 16) {
      cekNik();
    }
  }, [formData.nik]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const group = e.target.dataset.group; // Ambil "k1" atau "k2"

    if (group === 'k1'){
      if (value.length <= 16) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else if (group === 'k2'){
        setKesehatanData((prev) => ({
          ...prev,
          [name]: value,
        }));
    }
    
  };

  const cekNik = async () => {
    try {
      const res = await axios.post('http://localhost:8000/api/getAntrian', {
        nik: formData.nik
      });
      const data = res.data;
      const getNomor = res.data.nomoranda;

      setResumeData({
        nomorAnda: getNomor, 
        lokasi: data.lokasi,
        tglReserv: data.data.tanggal_reservasi,
        reservasi_id: data.data.id,
        namaLengkap: data.data.nama_lengkap,
        alamat: data.data.alamat,
        sim: data.data.sim,
        kebutuhan: data.data.jenis_perpanjangan,
      });

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

  const saveData = async () => {

    if (kesehatanData.td == "") {
      showToast('Tekanan Darah tidak boleh kosong ! ', ToastTypes.danger);
      return;
    }
    if (kesehatanData.tb == "") {
      showToast('Tinggi Badan tidak boleh kosong ! ', ToastTypes.danger);
      return;
    }
    if (kesehatanData.bb == "") {
      showToast('Berat Badan tidak boleh kosong ! ', ToastTypes.danger);
      return;
    }
    if (kesehatanData.suhu == "") {
      showToast('Suhu tidak boleh kosong ! ', ToastTypes.danger);
      return;
    }
    if (kesehatanData.nadi == "") {
      showToast('Nadi tidak boleh kosong ! ', ToastTypes.danger);
      return;
    }
    if (kesehatanData.nafas == "") {
      showToast('Pernafasan tidak boleh kosong ! ', ToastTypes.danger);
      return;
    }

    const payload = {
      ...kesehatanData,
      reserv_id: resumeData.reservasi_id
    }
    try {
      const response = await axios.post('http://localhost:8000/api/save-kesehatan', payload);
      showToast('Input Kesehatan Berhasil ', ToastTypes.sukses);
      window.location.reload();
    } catch (error) {
      showToast('Gagal menyimpan data ke database', ToastTypes.error);
    }
  };

  const isFormLengkap = Object.values(kesehatanData).every(val => val.trim() !== '');

  return (
    <div className={border_head}>
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Pelayanan Kesehatan
        </h2>

        {/* Section Title */}
        <div className={section_head}>
          <h3 className={section_font}>🧾 Data Pribadi</h3>
        </div>

        <div className={border_detail}>
          {/* Form Grid */}
          <div className={`${grid_head_nonform} gap-4`}>
            {/* Input NIK */}
            <div className={grid_4}>
              <label className={labelBiasa}>Masukan NIK</label>
              <input
                type="text" name="nik" data-group="k1" value={formData.nik} onChange={handleChange} maxLength="16" 
                className={boxColorLine} required/>
            </div>

            {/* Kolom Tambahan */}
            {resumeData.nomorAnda && (
              <>
                <div className={grid_4}>
                  <label className={labelBiasa}>Nama Lengkap</label>
                  <div className={textDisabled}>
                    {resumeData.namaLengkap}
                  </div>
                </div>
                <div className={grid_4}>
                  <label className={labelBiasa}>Tgl Reservasi Anda</label>
                  <div className={textDisabled}>
                    {resumeData.tglReserv}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Baris Baru: Tgl Reservasi */}
          {resumeData.nomorAnda && (
            <div className={`${grid_head_nonform} gap-4 mt-4`}>
              <div className={grid_2}>
                <label className={labelBiasa}>Lokasi</label>
                <div className={textDisabled}>
                  {resumeData.lokasi}
                </div>
              </div>
              <div className={grid_2}>
                <label className={labelBiasa}>No. Antri</label>
                <div className={textDisabled}>
                  {resumeData.nomorAnda}
                </div>
              </div>
              <div className={grid_2}>
                <label className={labelBiasa}>SIM</label>
                <div className={textDisabled}>
                  {resumeData.sim}
                </div>
              </div>
              <div className={grid_2}>
                <label className={labelBiasa}>Jenis</label>
                <div className={textDisabled}>
                  {resumeData.kebutuhan}
                </div>
              </div>
              <div className={grid_4}>
                <label className={labelBiasa}>Alamat</label>
                <div className={textDisabled}>
                  {resumeData.alamat}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section Title 2 */}
        {resumeData.nomorAnda && (
          <>
            <div className={section_head}>
              <h3 className={section_font}>🩺 Input Kesehatan</h3>
            </div>

            <div className={border_detail}>
              {/* Form Grid */}
              <div className={`${grid_head_nonform} gap-4`}>
                {/* Input NIK */}
                <div className={grid_3}>
                  <label className={labelBiasa}>Tekanan Darah</label>
                  <input type="text" name="td" data-group="k2" value={kesehatanData.td} onChange={handleChange} maxLength="7" className={boxColorLine} placeholder="mmHg" required/>
                </div>
                <div className={grid_3}>
                  <label className={labelBiasa}>Tinggi Badan</label>
                  <input type="text" name="tb" data-group="k2" value={kesehatanData.tb} onChange={handleChange} maxLength="3" className={boxColorLine} placeholder="Cm" required/>
                </div>
                <div className={grid_3}>
                  <label className={labelBiasa}>Berat Badan</label>
                  <input type="text" name="bb" data-group="k2" value={kesehatanData.bb} onChange={handleChange} maxLength="3" className={boxColorLine} placeholder="Kg" required/>
                </div>
                <div className={grid_3}>
                  <label className={labelBiasa}>Suhu</label>
                  <input type="text" name="suhu" data-group="k2" value={kesehatanData.suhu} onChange={handleChange} maxLength="2" className={boxColorLine} placeholder="°C" required/>
                </div>
              </div>
              <div className={`${grid_head_nonform} gap-4`}>
                {/* Input NIK */}
                <div className={grid_3}>
                  <label className={labelBiasa}>Nadi</label>
                  <input type="text" name="nadi" data-group="k2" value={kesehatanData.nadi} onChange={handleChange} maxLength="3" className={boxColorLine} placeholder="x/menit" required/>
                </div>
                <div className={grid_3}>
                  <label className={labelBiasa}>Pernafasan</label>
                  <input type="text" name="nafas" data-group="k2" value={kesehatanData.nafas} onChange={handleChange} maxLength="3" className={boxColorLine} placeholder="x/menit" required/>
                </div>
              </div>
            </div>
            
            <div className={itemPosition}>
              <button className={`${btnManualPulse} ${isFormLengkap ? 'animate-pulse' : 'opacity-50 cursor-not-allowed'}`} onClick={saveData}>Simpan</button>
            </div>
          </>
         )}
      </div>
    </div>
  );
}