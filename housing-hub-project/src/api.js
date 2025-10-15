import axios from 'axios';

// Dynamically set the base URL for API requests
// This will use your Render URL in production and localhost for development
const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-render-backend-url.onrender.com' // <-- IMPORTANT: Replace with your actual Render backend URL
  : 'http://localhost:3001';

// Dynamically set the WebSocket URL
// Use 'wss://' for secure WebSockets in production and 'ws://' for local development
export const WEBSOCKET_URL = process.env.NODE_ENV === 'production'
  ? 'wss://your-render-backend-url.onrender.com' // <-- IMPORTANT: Replace with your actual Render backend URL
  : 'ws://localhost:3001';

// Create an Axios instance with the base URL
const api = axios.create({
  baseURL: API_URL,
});

// Use an interceptor to automatically add the JWT token to all requests
// This ensures your backend routes are properly authenticated
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
