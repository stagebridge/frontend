// src/app/http.ts
import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:3000/api",
  timeout: 15000,
});

export default http;
