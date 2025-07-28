import React, { useState } from 'react';
import axios from 'axios';

const BookingForm = () => {
  const [tanggal, setTanggal] = useState('');
  const [jenis, setJenis] = useState('baru');
  const token = localStorage.getItem('token'); // kalau login token disimpan

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:8000/api/bookings', {
        jenis_permohonan: jenis,
        tanggal_booking: tanggal,
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // jika backend pakai token auth
        },
      });

      console.log('Booking sukses:', res.data);
      alert('Booking berhasil!');
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert('Booking gagal');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Jenis Permohonan:
        <select value={jenis} onChange={(e) => setJenis(e.target.value)}>
          <option value="baru">Baru</option>
          <option value="perpanjang">Perpanjang</option>
        </select>
      </label>
      <br />
      <label>
        Tanggal Booking:
        <input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} />
      </label>
      <br />
      <button type="submit">Booking SIM</button>
    </form>
  );
};

export default BookingForm;
