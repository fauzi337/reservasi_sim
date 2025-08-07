import axios from 'axios';

const axiosInstance = axios.create({
  // baseURL: 'http://192.168.1.4:8000/api', // ← LANGSUNG SET BASE URL DI SINI
  baseURL: 'http://localhost:8000/api', // ← LANGSUNG SET BASE URL DI SINI
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;