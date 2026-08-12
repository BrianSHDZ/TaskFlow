import axios from 'axios';

// Nota: Usa 10.0.2.2 si pruebas en emulador Android.
// Si usas la app Expo Go en un teléfono físico, cambia '10.0.2.2' por la IP local de tu PC (ej. 192.168.x.x).
const API = axios.create({
    baseURL: 'http://10.0.2.2:8080/api',
    //baseURL: 'http://192.168.0.118:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default API;