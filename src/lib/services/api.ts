import axios from "axios";

const api = axios.create({
  baseURL: "https://pulito-api-v01.onrender.com/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Log request details
api.interceptors.request.use((config) => {
  const fullUrl = `${config.baseURL}${config.url}`;
  console.log(`🚀 AXIOS REQUEST: [${config.method?.toUpperCase()}] ${fullUrl}`);
  return config;
});

// Log response or error details
api.interceptors.response.use(
  (response) => {
    console.log(`✅ AXIOS RESPONSE:`, response.status);
    return response;
  },
  (error) => {
    console.log(`❌ AXIOS ERROR:`, {
      url: error.config?.url,
      code: error.code, // e.g., 'ECONNABORTED'
      message: error.message,
      status: error.response?.status, // e.g., 401, 404, 500
    });
    return Promise.reject(error);
  },
);

export default api;
