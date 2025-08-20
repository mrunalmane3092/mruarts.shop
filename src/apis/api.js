import axios from 'axios';

// Base API URL (change when deploying)
const API = axios.create({
    baseURL: process.env.REACT_APP_API_BASE, // backend URL
});

export default API;