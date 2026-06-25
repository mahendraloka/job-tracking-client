import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Otomatis menyuntikkan Token Sanctum ke setiap request jika user sudah login
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
  },
  (error) => {
    return Promise.reject(error);
});

// 2. Interceptor Response: Polisi pengaman jika token di browser ternyata palsu/hangus
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Jika Laravel membalas dengan status 401 (Unauthorized/Token Tidak Valid)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token'); // Bersihkan token rusak dari browser
      
      // Paksa browser pindah ke halaman login jika saat ini tidak sedang di halaman login/register
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;