// src/utils/axiosInstance.js
import axios from "axios";

const BASE_API_URL = import.meta.env.VITE_BASE_URL;

if (!BASE_API_URL) {
  console.error("VITE_BASE_URL is not defined in the environment.");
}

const api = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
