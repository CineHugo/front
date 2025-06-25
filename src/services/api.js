import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
    baseURL: 'https://absolute-cinema-back.q7hbhh.easypanel.host/'
    // Removido withCredentials para evitar erro de CORS
})

// Interceptor para adicionar o token JWT no header Authorization
api.interceptors.request.use(
    (config) => {
        const token = Cookies.get('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;