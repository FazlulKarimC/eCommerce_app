// api.js
import axios from 'axios';

// Create an Axios instance with the top-level domain
const api = axios.create({
  baseURL: process.env.BASE_URL || 'http://localhost:3001', // 👈 Set your top-level domain here
  headers: {
    'Content-Type': 'application/json',
  },
  // You can add other defaults like timeout, authorization, etc.
});

export default api;
