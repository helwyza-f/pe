// src/lib/api.ts
import axios from "axios";
import { getCookie } from "cookies-next"; // Install: npm install cookies-next

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor untuk menyisipkan JWT Token secara otomatis
api.interceptors.request.use((config) => {
  const token = getCookie("auth_token"); // Nama cookie tempat kamu simpan JWT

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
