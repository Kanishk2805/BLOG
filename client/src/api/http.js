import axios from "axios";

// Shared Axios instance keeps base URL and credentials in one place.
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  withCredentials: true
});
