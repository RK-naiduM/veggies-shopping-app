// src/api.js
import axios from 'axios';

// 🔴 SMART BACKEND SELECTOR
// This automatically switches between Localhost (for you) and aws (for the public)
const API_URL = window.location.hostname === 'localhost' 
  ? "http://localhost:8080/api" 
  : "https://ag-5b5404c015c74239af5a9e0cd3c0bdd2.ecs.us-east-1.on.aws/api";

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