import axios from 'axios';

// ===================================================================================
// IMPORTANT: DEPLOYMENT CONFIGURATION
// ===================================================================================
// You MUST replace the placeholder URL below with your actual Render backend URL.
// 1. Go to your Render Dashboard.
// 2. Find your backend service (e.g., "housing-hub-backend").
// 3. Copy the URL (it will look something like: https://housing-hub-backend-xxxx.onrender.com).
// 4. Paste it here to replace the placeholder.
// ===================================================================================

const RENDER_BACKEND_URL = 'https://housing-hub-backend.onrender.com/'; 

// Dynamically set the base URL for API requests
const API_URL = process.env.NODE_ENV === 'production'
  ? RENDER_BACKEND_URL
  : 'http://localhost:3001';

// Dynamically set the WebSocket URL
export const WEBSOCKET_URL = process.env.NODE_ENV === 'production'
  ? RENDER_BACKEND_URL.replace(/^http/, 'ws') // Converts https:// to wss://
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

