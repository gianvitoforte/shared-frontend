import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://shared-backend.onrender.com',
    withCredentials: true,
});

export default instance;
