// Centralized, bulletproof Backend API URL resolver for local and cloud environments
const RAW_BACKEND_URL =
  (typeof import.meta !== "undefined" && import.meta.env && (import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL)) ||
  (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1"
    ? "https://pmintership2-0.onrender.com"
    : "http://localhost:8000");

export const BACKEND_URL = String(RAW_BACKEND_URL || "https://pmintership2-0.onrender.com").replace(/\/+$/, "");
export default BACKEND_URL;
