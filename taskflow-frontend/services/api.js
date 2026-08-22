import axios from 'axios';

const API = axios.create({
    //baseURL: 'http://10.0.2.2:8080/api', //android
    baseURL: 'http://localhost:8080/api', //web
    headers: {
        'Content-Type': 'application/json',
    },
});

export default API;