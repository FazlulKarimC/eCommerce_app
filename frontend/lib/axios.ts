import axios from 'axios';


const api = axios.create({
  baseURL: process.env.BASE_URL || 'https://ecommerce-app-backend-rq2y.onrender.com', 
    headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
