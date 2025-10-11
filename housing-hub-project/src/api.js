import axios from 'axios';

// Get the base URL from the environment variable (for Render) or default to localhost
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Create a new instance of axios with the base URL
const api = axios.create({
  baseURL: API_URL
});

// This automatically adds the user's auth token to every API request
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

// This creates the correct WebSocket URL for both local and deployed environments
export const WEBSOCKET_URL = API_URL.replace(/^http/, 'ws');

export default api;

