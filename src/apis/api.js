import axios from 'axios';

// Base API URL (change when deploying)
const API = axios.create({
    baseURL: 'http://localhost:5000/api', // backend URL
});

export default API;