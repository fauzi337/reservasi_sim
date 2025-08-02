import {
  inputClass, labelClass, grid_6, grid_12,grid_4,grid_head,itemPosition
} from "../styles/formClasses";
import { useEffect, useState } from "react";
import axios from 'axios';
import { ToastTypes } from '../constants/toastTypes';
import { useLocation } from 'react-router-dom';

function PanggilAntrianPage({ showToast }) {
  const [nomorAntrian, setNomorAntrian] = useState(null);
  const [lastCalled, setLastCalled] = useState(null);
  const [jenis, setJenis] = useState('PP');
  const [loket, setLoket] = useState('Loket 1');
  const [lokasi, setLokasi] = useState(localStorage.getItem('lokasi') || '');
  const [showFullForm, setShowFullForm] = useState(localStorage.getItem('showFullForm') === 'true');

  const jenisAntrianList = ['PP', 'BB'];
  const loketList = ['Loket 1', 'Loket 2', 'Loket 3'];
  const lokasiList = ['Polres A', 'Polres B', 'Polres C'];

  const [antrianData, setAntrianData] = useState({
      PP: { belum: 0, sudah: 0 },
      BB: { belum: 0, sudah: 0 },
  });

  useEffect(() => {
    const fetchAntrian = async () => {
      if (!lokasi) return;
      try {
        const res = await axios.get(`http://localhost:8000/api/status-antrian?lokasi=${lokasi}`);
        setAntrianData(res.data);
        console.log("Antrian berdasarkan lokasi:", res.data);
      } catch (err) {
        console.error('Gagal mengambil data antrian:', err);
      }
    };

    fetchAntrian();
  }, [lokasi]);

  const speak = (text) => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'id-ID';
    utter.rate = 0.9;
    utter.pitch = 1;

    const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        const indoVoice = voices.find(v => v.lang === 'id-ID');
        if (indoVoice) {
        utter.voice = indoVoice;
        }
        window.speechSynthesis.speak(utter);
    };

    if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
    } else {
        loadVoices();
    }
  };

  const playBellThenSpeak = (text) => {
    const bell = new Audio('/sounds/bell.mp3'); // pastikan file ini ada
    bell.play();

    bell.onended = () => {
      speak(text);
    };
  };

  const handlePanggil = async () => {
    const current = antrianData[jenis];
    if (current.belum > 0) {
      const nextNumber = current.sudah + 1;

      // 🔔 Mainkan suara bel dan bicara
      playBellThenSpeak(`Nomor antrian ${jenis} ${nextNumber}, silakan ke ${loket}`);

      // 🧠 Update state tampilan
      setNomorAntrian(nextNumber);
      setLokasi(lokasi);
      setLastCalled({ jenis, number: nextNumber });

      setAntrianData({
        ...antrianData,
        [jenis]: {
          belum: current.belum - 1,
          sudah: current.sudah + 1,
        },
      });

      // ✅ POST ke Laravel API
      try {
        await axios.post('http://localhost:8000/api/panggil-antrian', {
          jenis_antrian: jenis,
          nomor: nextNumber,
          loket: loket,
          status: 'dipanggil',
          lokasi: lokasi,
          // waktu: new Date().toISOString(), // waktu panggil ISO format
        });

        showToast(`Memanggil antrian nomor ${jenis} ${nextNumber}`, ToastTypes.sukses);
      } catch (error) {
        // console.error('Gagal menyimpan ke database:', error);
        showToast('Gagal menyimpan ke database', ToastTypes.error);
      }
    } else {
      showToast(`Tidak ada antrian ${jenis} yang tersisa`, ToastTypes.warning);
    }
  };

  const handlePanggilUlang = () => {
    if (lastCalled) {
      playBellThenSpeak(`Nomor antrian ${lastCalled.jenis} ${lastCalled.number}, silakan ke ${loket}`);
      // speak(`Panggilan ulang untuk nomor ${lastCalled.jenis} ${lastCalled.number}, silahkan ke ${loket}`);
      showToast(`Panggilan ulang nomor ${lastCalled.jenis} ${lastCalled.number}`, ToastTypes.info);
    } else {
      showToast(`Belum ada antrian yang dipanggil`, ToastTypes.warning);
    }
  };

  const handleSearchLokasi = async () => {
    if (lokasi) {
      localStorage.setItem('lokasi', lokasi);
      localStorage.setItem('showFullForm', 'true');
      setShowFullForm(true);
      showToast(`Lokasi "${lokasi}" dipilih. Silakan lanjutkan.`, ToastTypes.sukses);
    }
  };

  const handleResetLokasi = () => {
    localStorage.removeItem('lokasi');
    localStorage.removeItem('showFullForm');
    setShowFullForm(false);
    setLokasi('');
  };


  return (
    <div className="container mt-5">
      <h2 className="mb-4">Panggil Antrian</h2>

      <div className={grid_head}>
        {/* LOKASI & SEARCH SAJA */}
        {!showFullForm && (
          <>
            <div className={grid_4}>
              <label className={labelClass}>Pilih Lokasi</label>
              <select className={inputClass} value={lokasi} onChange={(e) => setLokasi(e.target.value)}>
                {lokasiList.map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <button className="btn btn-success" onClick={handleSearchLokasi}>Search</button>
            </div>
          </>
        )}

        {/* FORM LANJUTAN */}
        {showFullForm && (
        <>
        <div className={grid_4}>
          <label className={labelClass}>Jenis Antrian</label>
          <select className={inputClass} value={jenis} onChange={(e) => setJenis(e.target.value)}>
            {jenisAntrianList.map((j) => (
              <option key={j} value={j}>{j}</option>
            ))}
          </select>
        </div>

        <div className={grid_4}>
          <label className={labelClass}>Loket</label>
          <select className={inputClass} value={loket} onChange={(e) => setLoket(e.target.value)}>
            {loketList.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
         </>
        )}
      </div>

        {showFullForm && (
          <>
            <div className={itemPosition}>
              <button className="btn btn-primary" onClick={handlePanggil}>Panggil</button>
              <button className="btn btn-warning" onClick={handlePanggilUlang}>Panggil Ulang</button>
              <button className="btn btn-secondary" onClick={handleResetLokasi}>Ganti Lokasi</button>
            </div>
          </>
        )}

      {showFullForm && (
        <>
          {nomorAntrian && (
            <div className="alert alert-info mt-3" role="alert">
              Nomor antrian yang dipanggil: <strong>{jenis} {nomorAntrian} {loket}</strong>
            </div>
          )}
          <div className="mt-4">
            <h5>Status Antrian Hari Ini</h5>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Jenis</th>
                  <th>Belum Dipanggil</th>
                  <th>Sudah Dipanggil</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(antrianData).map(([jenis, data]) => (
                  <tr key={jenis}>
                    <td>{jenis}</td>
                    <td>{data.belum}</td>
                    <td>{data.sudah}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default PanggilAntrianPage;
