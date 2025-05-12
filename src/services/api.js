import axios from "axios";

const api = axios.create({
    baseURL: 'https://back-production-352b.up.railway.app/'
})

export default api;