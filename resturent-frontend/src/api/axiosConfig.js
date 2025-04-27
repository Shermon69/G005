// src/api/axiosConfig.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8081/v1/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
