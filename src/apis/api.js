import axios from 'axios';

// Base API URL (change when deploying)
console.log(process.env.REACT_APP_API_BASE)
const API = axios.create({
    baseURL: process.env.REACT_APP_API_BASE, // backend URL
});

export default API;