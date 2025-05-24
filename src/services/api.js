import axios from "axios";

const api = axios.create({
    // baseURL: 'https://back-production-352b.up.railway.app/'
    baseURL: 'http://localhost:8000'
})

export default api;