import axios from 'axios';
import {getAccessToken, getRefreshToken, getBMDC} from "../utils/accessutils";

const api = axios.create({
  baseURL: 'https://5107341b03b5.ngrok-free.app',
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// Request Interceptor: attach both tokens
api.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    const verificationToken = getRefreshToken();
    const bmdc = getBMDC();

    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    if (verificationToken) {
      config.headers['Verification'] = `Bearer ${verificationToken}`;
    }

    if (bmdc) {
      config.headers['bmdc'] = bmdc;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor (optional: token refresh logic)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post('https://5107341b03b5.ngrok-free.app/auth/refresh', {
          refreshToken,
        });

        localStorage.setItem('accessToken', data.accessToken);
        api.defaults.headers['Authorization'] = `Bearer ${data.accessToken}`;
        processQueue(null, data.accessToken);

        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
