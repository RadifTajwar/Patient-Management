import axios from "axios";
import { getAccessToken, getRefreshToken, getBMDC } from "../utils/accessutils";

const api = axios.create({
  baseURL: "https://patient-management-backend-o1ga.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor — attach tokens
api.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    const verificationToken = getRefreshToken();
    const bmdc = getBMDC();

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    if (verificationToken) {
      config.headers["Verification"] = `Bearer ${verificationToken}`;
    }

    if (bmdc) {
      config.headers["bmdc"] = bmdc;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor — no refresh attempt, just pass errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optional: You may handle 401 here, but no refresh
    // For example:
    // if (error.response?.status === 401) {
    //   console.log("Unauthorized - token may be expired");
    // }

    return Promise.reject(error);
  }
);

export default api;
