import axios from "axios";
import * as SecureStore from "expo-secure-store";

export type ApiResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  data: T;
};

const api = axios.create({
  baseURL: "https://pulito-api-v01.onrender.com",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Log request details
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("user_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const fullUrl = `${config.baseURL}${config.url}`;
  console.log(`🚀 AXIOS REQUEST: [${config.method?.toUpperCase()}] ${fullUrl}`);
  console.log("payload:", config.data);
  return config;
});

// Log response or error details
api.interceptors.response.use(
  (response) => {
    console.log(`✅ AXIOS RESPONSE:`, response.status);
    return response;
  },
  (error) => {
    const response = error.response?.data;
    console.log(`❌ AXIOS ERROR:`, {
      url: error.config?.url,
      code: error.code, //
      message: response?.message || error.message,
      status: response?.statusCode || error.response?.status,
      data: response?.data,
    });
    return Promise.reject(error);
  },
);

export default api;
