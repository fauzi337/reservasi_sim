import { Link } from 'react-router-dom';
import {
  inputClass,labelClass,radioGroupClassYes,radioGroupClassNo,grid_head,grid_1,grid_2,grid_3,grid_4,grid_5,grid_6,grid_7,grid_8,
  grid_9,grid_10,grid_11,grid_12,
} from "../styles/formClasses"; // path menyesuaikan dengan struktur proyekmu
import { useEffect, useState } from "react";
import axios from 'axios';
import { ToastTypes } from '../constants/toastTypes';
import { useLocation } from 'react-router-dom';
import './ViewerLanding.css';

function ViewerLanding(params) {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
        {/* Background Layer */}
        <div
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{ backgroundImage: "url('/images/Caller_System.jpg')" }}
        ></div>

        {/* Foreground Content */}
        <div className="relative z-10 text-black text-center px-4">
            <div className="container">
            <h1 className="text-3xl font-bold mb-6">Selamat Datang Petugas di Sistem Manajemen Reservasi SIM</h1>

            {/* Tombol-tombol */}
            <div className="flex flex-col md:flex-row justify-center gap-4">
                <Link to="/reservasi" className="btn btn-info">
                Buat Reservasi
                </Link>
                <Link to="/resume-antrian" className="btn btn-info">
                Lihat Resume Antrian
                </Link>
                <Link to="/panggil-antrian" className="btn btn-info">
                Panggil Antrian
                </Link>
                <Link to="/input-kesehatan" className="btn btn-info">
                Input Kesehatan
                </Link>
            </div>
            </div>
        </div>
    </div>

  );
}




export default ViewerLanding;
       