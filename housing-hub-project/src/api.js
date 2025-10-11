import axios from 'axios';

// Get the base URL from the environment variable set by Render
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Create a new instance of axios with the base URL
const api = axios.create({
  baseURL: API_URL
});

// This is an "interceptor" that automatically adds the user's
// authentication token to every single API request.
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

// This creates the correct WebSocket URL for both local and deployed environments.
// It changes http -> ws and https -> wss.
export const WEBSOCKET_URL = API_URL.replace(/^http/, 'ws');

export default api;