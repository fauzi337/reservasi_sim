import {
  inputClass,labelClass,radioGroupClassYes,radioGroupClassNo,grid_head,grid_1,grid_2,grid_3,grid_4,grid_5,grid_6,grid_7,grid_8,
  grid_9,grid_10,grid_11,grid_12,
} from "../styles/formClasses"; // path menyesuaikan dengan struktur proyekmu
import { useEffect, useState } from "react";
import axios from 'axios';
import { ToastTypes } from '../constants/toastTypes';
import { useNavigate } from 'react-router-dom';

export default function ReservasiPage({showToast}) {
  const navigate = useNavigate(); // letakkan di atas
  const [today, setToday] = useState("");

  useEffect(() => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    setToday(`${yyyy}-${mm}-${dd}`);
  }, []);

  const [formData, setFormData] = useState({
    tanggal_reservasi: '',
    nik: '',
    sim_lama: '',
    nama_lengkap: '',
    jk: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    tinggi_badan: '',
    pekerjaan: '',
    no_hp: '',
    alamat: '',
    pendidikan: '',
    fc: '',
    bm: '',
    cf: '',
    sm: '',
    lokasi: '',
    jenis_perpanjangan: '',
    si: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // cegah reload

    try {
    const res = await axios.post('http://localhost:8000/api/reservasi', formData);
    showToast("Reservasi berhasil!", ToastTypes.sukses);  // success
    navigate("/resume-antrian", {
      // state: {
      //   nomorAnda: "PP-2", // kamu bisa ambil dari response jika disediakan
      //   nomorSaatIni: "PP-1",
      //   estimasi,
      // }
    });
    } catch (err) {
      console.error("Catch error: ", err?.response?.data);

      const errorMsg = err?.response?.data?.message || "Terjadi kesalahan!";
      showToast(errorMsg, ToastTypes.danger);  // 🟢 pastikan ini terpanggil
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-4 text-indigo-600">Formulir Reservasi SIM</h2>
        <p className="text-gray-700 mb-6">
          Silakan isi data Anda untuk memulai proses reservasi.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white shadow-md rounded-xl max-w-3xl mx-auto">
          {/* <h2 className="text-2xl font-semibold">Form Reservasi SIM</h2> */}
          <div className={grid_head}>
          {/* 1. Tanggal Reservasi */}
            <div className={grid_3}>
              <label className={labelClass}>Tanggal Reservasi</label>
              <input type="date" name="tanggal_reservasi" onChange={handleChange} min={today} className={inputClass} required />
            </div>
            {/* 2. NIK */}
            <div className={grid_4}>
              <label className={labelClass}>NIK</label>
              <input type="text" name="nik" onChange={handleChange} maxLength="16" className={inputClass} required />
            </div>
            {/* 4. Nama Lengkap */}
            <div className={grid_3}>
              <label className={labelClass}>Nama Lengkap</label>
              <input type="text" name="nama_lengkap" onChange={handleChange} className={inputClass} required />
            </div>
            {/* 8. Tinggi Badan */}
            <div className={grid_2}>
              <label className={labelClass}>Tinggi (cm)</label>
              <input type="text" name="tinggi_badan" onChange={handleChange} maxLength="3" className={inputClass} required />
            </div>
          </div>
          <div className={grid_head}>
            {/* 5. Jenis Kelamin */}
            <div className={grid_6}>
              <label className={labelClass}>Jenis Kelamin</label>
              <div className="flex gap-4">
                <div className="flex gap-4"> 
                  <input type="radio" name="jk" onChange={handleChange} id="jk-l" value="Laki-laki" className="peer hidden" />
                  <label htmlFor="jk-l" className={radioGroupClassYes}>
                    Laki-laki
                  </label>
                </div>
                <div className="flex gap-4">
                  <input type="radio" name="jk" onChange={handleChange} id="jk-p" value="Perempuan" className="peer hidden" />
                  <label htmlFor="jk-p" className={radioGroupClassYes}>
                    Perempuan
                  </label>
                </div>
              </div>
            </div>
            {/* 6. Tempat Lahir */}
            <div className={grid_3}>
              <label className={labelClass}>Tempat Lahir</label>
              <input type="text" name="tempat_lahir" onChange={handleChange} className={inputClass} required />
            </div>
            {/* 7. Tanggal Lahir */}
            <div className={grid_3}>
              <label className={labelClass}>Tanggal Lahir</label>
              <input type="date" name="tanggal_lahir" onChange={handleChange} className={inputClass} required />
            </div>
          </div>
          <div className={grid_head}>
            {/* 10. No Handphone */}
            <div className={grid_4}>
              <label className={labelClass}>No Hp</label>
              <input type="number" name="no_hp" onChange={handleChange} maxLength="12" className={inputClass} required />
            </div>
            {/* 9. Pekerjaan */}
            <div className={grid_4}>
              <label className={labelClass}>Pekerjaan</label>
              <select name="pekerjaan" onChange={handleChange} className={inputClass} required>
                <option value="">-- Pilih Pekerjaan --</option>
                <option>Pelajar/Mahasiswa</option>
                <option>Karyawan Swasta</option>
                <option>ASN</option>
                <option>Wiraswasta</option>
                <option>Lainnya</option>
              </select>
            </div>
            {/* 3. Nomor SIM Lama */}
            <div className={grid_4}>
              <label className={labelClass}>Nomor SIM Lama</label>
              <input type="text" name="sim_lama" onChange={handleChange} maxLength="15" className={inputClass} required />
            </div>
          </div>
          <div className={grid_head}>
            {/* 11. Alamat Domisili */}
            <div className={grid_12}>
              <label className={labelClass}>Alamat Domisili</label>
              <textarea name="alamat" onChange={handleChange} className={inputClass} rows="3" required />
            </div>
          </div>
          <div className={grid_head}>
            {/* 12. Pendidikan Terakhir */}
            <div className={grid_4}>
              <label className={labelClass}>Pendidikan Terakhir</label>
              <select name="pendidikan" onChange={handleChange} className={inputClass} required>
                <option value="">-- Pilih Pendidikan --</option>
                <option>SD</option>
                <option>SMP</option>
                <option>SMA/SMK</option>
                <option>D3</option>
                <option>S1</option>
                <option>S2</option>
                <option>S3</option>
              </select>
            </div>
            {/* 17. Lokasi */}
            <div className={grid_4}>
              <label className={labelClass}>Lokasi</label>
              <select name="lokasi" onChange={handleChange} className={inputClass} required>
                <option value="">-- Pilih Lokasi --</option>
                <option>Polres A</option>
                <option>Polres B</option>
                <option>Polres C</option>
              </select>
            </div>
            {/* 18. Jenis Perpanjangan */}
            <div className={grid_4}>
              <label className={labelClass}>Kebutuhan</label>
              <select name="jenis_perpanjangan" onChange={handleChange} className={inputClass} required>
                <option value="">-- Pilih Jenis --</option>
                <option>Perpanjang</option>
                <option>Buat Baru</option>
              </select>
            </div>
          </div>
          <dic className={grid_head}>
            <div className={grid_12}>
              <label className={labelClass}>SIM</label>
              <div className="flex gap-4">
                <div className="flex gap-4"> 
                  <input type="radio" name="si" onChange={handleChange} id="si-a" value="SIM A" className="peer hidden" />
                  <label htmlFor="si-a" className={radioGroupClassYes}>
                    SIM A
                  </label>
                </div>
                <div className="flex gap-4">
                  <input type="radio" name="si" onChange={handleChange} id="si-b1" value="SIM B1" className="peer hidden" />
                  <label htmlFor="si-b1" className={radioGroupClassYes}>
                    SIM B1
                  </label>
                </div>
                <div className="flex gap-4"> 
                  <input type="radio" name="si" onChange={handleChange} id="si-b2" value="SIM B2" className="peer hidden" />
                  <label htmlFor="si-b2" className={radioGroupClassYes}>
                    SIM B2
                  </label>
                </div>
                <div className="flex gap-4">
                  <input type="radio" name="si" onChange={handleChange} id="si-c" value="SIM C" className="peer hidden" />
                  <label htmlFor="si-c" className={radioGroupClassYes}>
                    SIM C
                  </label>
                </div>
                <div className="flex gap-4">
                  <input type="radio" name="si" onChange={handleChange} id="si-d" value="SIM D" className="peer hidden" />
                  <label htmlFor="si-d" className={radioGroupClassYes}>
                    SIM D
                  </label>
                </div>
              </div>
            </div>
          </dic>
          <div className={grid_head}>
            {/* 13. Foto Copy */}
            <div className={grid_6}>
              <label className={labelClass}>Foto Copy</label>
              <div className="flex gap-4">
                <div className="flex gap-4"> 
                  <input type="radio" name="fc" onChange={handleChange} id="fc-a" value="Ada" className="peer hidden" />
                  <label htmlFor="fc-a" className={radioGroupClassYes}>
                    Ada
                  </label>
                </div>
                <div className="flex gap-4">
                  <input type="radio" name="fc" onChange={handleChange} id="fc-t" value="Tidak Ada" className="peer hidden" />
                  <label htmlFor="fc-t" className={radioGroupClassNo}>
                    Tidak Ada
                  </label>
                </div>
              </div>
            </div>
            {/* 16. Sertifikat Mengemudi */}
            <div className={grid_6}>
              <label className={labelClass}>Sertifikat Mengemudi</label>
              <div className="flex gap-4">
                <div className="flex gap-4"> 
                  <input type="radio" name="sm" onChange={handleChange} id="sm-a" value="Ada" className="peer hidden" />
                  <label htmlFor="sm-a" className={radioGroupClassYes}>
                    Ada
                  </label>
                </div>
                <div className="flex gap-4">
                  <input type="radio" name="sm" onChange={handleChange} id="sm-t" value="Tidak Ada" className="peer hidden" />
                  <label htmlFor="sm-t" className={radioGroupClassNo}>
                    Tidak Ada
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className={grid_head}>
            {/* 15. Cacat Fisik */}
            <div className={grid_6}>
              <label className={labelClass}>Cacat Fisik</label>
              <div className="flex gap-4">
                <div className="flex gap-4"> 
                  <input type="radio" name="cf" onChange={handleChange} id="cf-a" value="Ada" className="peer hidden" />
                  <label htmlFor="cf-a" className={radioGroupClassYes}>
                    Ada
                  </label>
                </div>
                <div className="flex gap-4">
                  <input type="radio" name="cf" onChange={handleChange} id="cf-t" value="Tidak" className="peer hidden" />
                  <label htmlFor="cf-t" className={radioGroupClassNo}>
                    Tidak
                  </label>
                </div>
              </div>
            </div>
            {/* 14. Berkaca mata */}
            <div className={grid_6}>
              <label className={labelClass}>Berkaca Mata</label>
              <div className="flex gap-4">
                <div className="flex gap-4"> 
                  <input type="radio" name="bm" onChange={handleChange} id="bm-a" value="Ada" className="peer hidden" />
                  <label htmlFor="bm-a" className={radioGroupClassYes}>
                    Ada
                  </label>
                </div>
                <div className="flex gap-4">
                  <input type="radio" name="bm" onChange={handleChange} id="bm-t" value="Tidak" className="peer hidden" />
                  <label htmlFor="bm-t" className={radioGroupClassNo}>
                    Tidak
                  </label>
                </div>
              </div>
            </div>
          </div>
          <button type="submit" className="mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-green-700">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
