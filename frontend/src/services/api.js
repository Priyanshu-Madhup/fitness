import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor – attach auth token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fitai_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor – normalise errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

// ── Plan ──────────────────────────────────────────────────────────────────────
export const generatePlan = (formData) =>
  api.post('/generate-plan', formData);

// ── Chat ──────────────────────────────────────────────────────────────────────
export const sendChatMessage = (messages) =>
  api.post('/chat', { messages });

// ── Events ────────────────────────────────────────────────────────────────────
export const fetchEvents = () => api.get('/events');

// ── Gyms / Parks ──────────────────────────────────────────────────────────────
export const fetchGyms = (lat, lng) =>
  api.get('/gyms', { params: { lat, lng } });

// ── Videos ────────────────────────────────────────────────────────────────────
export const fetchVideos = (query) =>
  api.get('/videos', { params: { query } });

export default api;
