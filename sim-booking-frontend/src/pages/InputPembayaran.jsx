import {
  itemPosition, grid_3, grid_head_nonform, grid_4,border_head,border_detail,labelBiasa,textDisabled,boxColorLine,section_head,section_font,
  grid_2,btnManualPulse,btnPulse,grid_1,textDisabledRed,textDisabledGreen,textDisabledOrange
} from "../styles/formClasses";
import { useEffect, useState } from "react";
// import axios from 'axios';
import { ToastTypes } from '../constants/toastTypes';
import { useLocation } from 'react-router-dom';
import axios from '../api/axios';

export default function InputPembayaran({ showToast }) {
  const [today, setToday] = useState("");
  const [formData, setFormData] = useState({ nik: '', pelayanan: '' });


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
    dibayar: '',
    verifikasist: '',
  });

  const [pembayaranData, setPembayaranData] = useState({
    nominal: '',
    kembali: '',
  });

  const formatRupiah = (angka) => {
    if (!angka) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
  };

  const formatRupiahInput = (value) => {
  const angka = value.replace(/[^\d]/g, '');
  const formatter = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    });
    return formatter.format(angka);
  };

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
      if (name === 'nominal') {
        const numericValue = unformatRupiah(value);
        const kembali = numericValue - parseInt(resumeData.dibayar || 0);

        setPembayaranData({
          ...pembayaranData,
          nominal: formatRupiahInput(value),
          kembali: kembali >= 0 ? kembali : 0
        });
      }
    }
  };

  const cekNik = async () => {
    try {
      const res = await axios.post('/getAntrian', {
        nik: formData.nik
      });
      const data = res.data;
      const getNomor = res.data.nomoranda;

      setResumeData({
        nomorAnda: getNomor, 
        tglReserv: data.data.tanggal_reservasi,
        reservasi_id: data.data.id,
        namaLengkap: data.data.nama_lengkap,
        alamat: data.data.alamat,
        sim: data.data.sim,
        kebutuhan: data.data.jenis_perpanjangan,
        dibayar: data.hargasim,
        verifikasist: data.status.verifikasi,
        pembayaranst: data.status.pembayaran,
        sehatst: data.status.kesehatan,
        fotost: data.status.foto,
        simst: data.status.pengambilan
      });

      showToast("Ambil Data Berhasil !", ToastTypes.sukses);
    } catch (err) {
      if (err.response?.status === 422) {
        const validationErrors = err.response.data.errors;
        const msg = validationErrors ? Object.values(validationErrors).flat().join(', ') : 'Validasi gagal!';
        showToast(msg, ToastTypes.danger);
      } else {
        const errorMsg = err.response?.data?.message || err.message || 'Terjadi kesalahan!';
        showToast('Nik: ' + formData.nik + ' Tidak Ada !', ToastTypes.danger);
      }
    }
  };

  const unformatRupiah = (formatted) => {
    return parseInt((formatted || '').toString().replace(/[^\d]/g, '')) || 0;
  };

  const saveData = async () => {
    
    const payload = {
      reserv_id: resumeData.reservasi_id,
      nominal: unformatRupiah(pembayaranData.nominal),
      dibayar: unformatRupiah(resumeData.dibayar),
      kembali: unformatRupiah(pembayaranData.kembali),
    }

    if (resumeData.sehatst != 'Sudah') {
      showToast('Silahkan Tes Kesehatan Terlebih Dahulu !', ToastTypes.warning);
      return;
    }

    if (formData.pelayanan === 'pembayaran') {
      // if (pembayaranData.kembali == 0) {
      //   showToast('Kembalian Tidak boleh 0 ! ', ToastTypes.warning);
      //   return;
      // }
      if (pembayaranData.nominal <= 0) {
        showToast('Nominal Tidak boleh 0 ! ', ToastTypes.warning);
        return;
      }
      if (payload.nominal < payload.dibayar) {
        showToast('Nominal Tidak boleh Kurang Dari Total Dibayar ! ', ToastTypes.warning);
        return;
      }
      if (resumeData.verifikasist != 'Sudah') {
        showToast('Silahkan Verifikasi Barcode Terlebih Dahulu !', ToastTypes.warning);
        return;
      }
      if (resumeData.pembayaranst == 'Sudah') {
        showToast('Pelanggan Sudah Bayar !', ToastTypes.warning);
        return;
      }
      try {
        const response = await axios.post('/save-pembayaran', payload);
        showToast('Input Pembayaran Berhasil ', ToastTypes.sukses);
        window.location.reload();
      } catch (error) {
        showToast('Pembayaran Gagal !', ToastTypes.error);
      }
    } else if (formData.pelayanan === 'foto') {    
      if (resumeData.fotost == 'Belum') {
        showToast('Silahkan Menunggu Antrian Foto Terlebih Dahulu !', ToastTypes.warning);
        return;
      }
      if (resumeData.pembayaranst == 'Belum') {
        showToast('Silahkan Melakukan Pembayaran Terlebih Dahulu !', ToastTypes.warning);
        return;
      }
      try {
        const response = await axios.post('/save-foto', payload);
        showToast('Input Foto Berhasil ', ToastTypes.sukses);
        window.location.reload();
      } catch (error) {
        showToast('Foto Gagal !', ToastTypes.error);
      }
    } else if (formData.pelayanan === 'ambil') {
      if (resumeData.fotost != 'Sudah') {
        showToast('Silahkan Menunggu Antrian Pengambilan SIM Terlebih Dahulu !', ToastTypes.warning);
        return;
      }
      try {
        const response = await axios.post('/save-ambil-sim', payload);
        showToast('Input Ambil SIM Berhasil ', ToastTypes.sukses);
        window.location.reload();
      } catch (error) {
        showToast('Ambil SIM Gagal !', ToastTypes.error);
      }
    } else {
      if (resumeData.verifikasist == 'Sudah') {
        showToast('Pelanggan Sudah Verifikasi !', ToastTypes.warning);
        return;
      }

      try {
        const response = await axios.post('/save-verifikasi', payload);
        showToast('Input verifikasi Berhasil ', ToastTypes.sukses);
        window.location.reload();
      } catch (error) {
        showToast('Verifikasi Barcode Gagal !', ToastTypes.error);
      }
    }
  };

  const isFormLengkap = Object.values(pembayaranData).every(val => val !== null && val !== '' && !isNaN(val));

  return (
    <div className={border_head}>
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          {formData.pelayanan === 'pembayaran' ? 'Pelayanan Pembayaran' : 
          formData.pelayanan === 'verifikasi' ? 'Pelayanan Verifikasi Barcode': 
          formData.pelayanan === 'foto' ? 'Pelayanan Foto':
          formData.pelayanan === 'ambil' ? 'Pelayanan Pengambilan SIM': ''}
        </h2>

        {/* Section Title */}
        <div className={section_head}>
          <h3 className={section_font}>🧾 Data Pribadi</h3>
        </div>

        <div className={border_detail}>
          {/* Form Grid */}
          <div className={`${grid_head_nonform} gap-4`}>
            <div className={grid_4}>
              <label className={labelBiasa}>Pelayanan</label>
              <select name="pelayanan" data-group="k1" value={formData.pelayanan} onChange={handleChange} className={boxColorLine} required>
                <option value="">-- Pilih Pelayanan --</option>
                <option value="verifikasi">Verifikasi Barcode</option>
                <option value="pembayaran">Pembayaran</option>
                <option value="foto">Foto</option>
                <option value="ambil">Pengambilan SIM</option>
              </select>
            </div>
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
              </>
            )}
          </div>

          {/* Baris Baru: Tgl Reservasi */}
          {resumeData.nomorAnda && (
            <div className={`${grid_head_nonform} gap-4 mt-4`}>
              <div className={grid_3}>
                <label className={labelBiasa}>Tgl Reservasi Anda</label>
                <div className={textDisabled}>
                  {resumeData.tglReserv}
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
              <div className={grid_3}>
                <label className={labelBiasa}>Alamat</label>
                <div className={textDisabled}>
                  {resumeData.alamat}
                </div>
              </div>
              {resumeData.pembayaranst !== null &&(
              <div className={grid_2}>
                <label className={labelBiasa}>Bayar</label>
                <div className={`${resumeData.pembayaranst === 'Sudah' ? textDisabledGreen : textDisabledRed } `}>
                  {resumeData.pembayaranst}
                </div>
              </div>
              )}
            </div>
          )}
          {resumeData.nomorAnda && formData.pelayanan === 'ambil' && (
            <div className={`${grid_head_nonform} gap-4 mt-4`}>
              <div className={grid_2}>
                <label className={labelBiasa}>Kesehatan</label>
                <div className={`${resumeData.sehatst === 'Sudah' ? textDisabledGreen : resumeData.sehatst === 'dipanggil' ? textDisabledOrange : textDisabledRed } `}>
                  {resumeData.sehatst}
                </div>
              </div>
              <div className={grid_3}>
                <label className={labelBiasa}>Verifikasi Barcode</label>
                <div className={`${resumeData.verifikasist === 'Sudah' ? textDisabledGreen : resumeData.verifikasist === 'dipanggil' ? textDisabledOrange : textDisabledRed } `}>
                  {resumeData.verifikasist}
                </div>
              </div>
              <div className={grid_2}>
                <label className={labelBiasa}>Foto</label>
                <div className={`${resumeData.fotost === 'Sudah' ? textDisabledGreen : resumeData.fotost === 'dipanggil' ? textDisabledOrange : textDisabledRed } `}>
                  {resumeData.fotost}
                </div>
              </div>
              <div className={grid_3}>
                <label className={labelBiasa}>Pengambilan SIM</label>
                <div className={`${resumeData.simst === 'Sudah' ? textDisabledGreen : resumeData.simst === 'dipanggil' ? textDisabledOrange : textDisabledRed } `}>
                  {resumeData.simst}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section Title 2 */}
        {resumeData.nomorAnda && formData.pelayanan === 'pembayaran' && (
          <>
            <div className={section_head}>
              <h3 className={section_font}>💵 Input Pembayaran</h3>
            </div>

            <div className={border_detail}>
              {/* Form Grid */}
              <div className={`${grid_head_nonform} gap-4`}>
                {/* Input NIK */}
                <div className={grid_4}>
                  <label className={labelBiasa}>Nominal</label>
                  <input type="text" name="nominal" data-group="k2" value={pembayaranData.nominal} onChange={handleChange} maxLength="15" className={boxColorLine} required/>
                </div>
                <div className={grid_4}>
                  <label className={labelBiasa}>Total Dibayar</label>
                  <div className={textDisabled} data-group="k2">
                    {formatRupiah(resumeData.dibayar)}
                  </div>
                </div>
                <div className={grid_4}>
                  <label className={labelBiasa}>Kembalian</label>
                  <input type="text" name="kembali" data-group="k2" value={formatRupiah(pembayaranData.kembali)} onChange={handleChange} className={boxColorLine} required disabled/>
                </div>
              </div>
            </div>
          </>
         )}
         {resumeData.nomorAnda && formData.pelayanan !== 'pembayaran' &&(
          <div className={itemPosition}>
            <button className={`${btnManualPulse} ${formData.pelayanan !== 'pembayaran' ? 'animate-pulse' : 'opacity-50 cursor-not-allowed'}`} onClick={saveData}>Simpan</button>
          </div>
         )}
         {resumeData.nomorAnda && formData.pelayanan === 'pembayaran' &&(
          <div className={itemPosition}>
            <button className={`${btnManualPulse} ${isFormLengkap ? 'animate-pulse' : 'opacity-50 cursor-not-allowed'}`} onClick={saveData}>Simpan</button>
          </div>
         )}
      </div>
    </div>
  );
}