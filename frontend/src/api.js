// src/api.js
import axios from 'axios';

// 🔴 SMART BACKEND SELECTOR
// This automatically switches between Localhost (for you) and Render (for the public)
const API_URL = window.location.hostname === 'localhost' 
  ? "http://localhost:5000/api" 
  : "https://veggies-shopping-app.onrender.com/api"; // 👈 REPLACE THIS with your actual Render URL

const API = axios.create({
  baseURL: API_URL
});

// Add Token to requests if logged in
API.interceptors.request.use((req) => {
  if (localStorage.getItem('token')) {
    req.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }
  return req;
});

export default API;