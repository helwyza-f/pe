import axios from "axios";
import { getCookie } from "cookies-next";

// Ambil Base URL dari Env (Pastikan di Vercel Dashboard sudah di-set)
const baseURL = process.env.NEXT_PUBLIC_API_URL || "https://api.bookinaja.com/api/v1";

// Debugging: Muncul di Console Browser (F12) untuk memastikan arah request
if (process.env.NODE_ENV === "development") {
  console.log("🚀 Axios BaseURL:", baseURL);
}

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor untuk menyisipkan JWT Token secara otomatis
api.interceptors.request.use((config) => {
  const token = getCookie("auth_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;