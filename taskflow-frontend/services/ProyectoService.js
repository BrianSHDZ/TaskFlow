/*import axios from 'axios';

// Utiliza la IP correspondiente para tu entorno (10.0.2.2 para el emulador Android de Android Studio)
const API_URL = 'http://10.0.2.2:8080/api/taskflow/proyecto';

export const getProyectosPorUsuario = async (usuarioId) => {
    const response = await axios.get(`${API_URL}/usuario/${usuarioId}`);
    return response.data;
};

export const createProyecto = async (proyectoData) => {
    // proyectoData debe incluir: { titulo, descripcion, creadoPor }
    const response = await axios.post(API_URL, proyectoData);
    return response.data;
};

export const deleteProyecto = async (proyectoId) => {
    const response = await axios.delete(`${API_URL}/${proyectoId}`);
    return response.data;
};*/
//version 2
import axios from 'axios';

// Si usas emulador Android Studio usa 10.0.2.2; si usas celular físico por Wi-Fi usa tu IP local (ej. 192.168.1.X)
const API_URL = 'http://10.0.2.2:8080/api/taskflow/proyecto';

export const getProyectosPorUsuario = async (usuarioId) => {
    const response = await axios.get(`${API_URL}/usuario/${usuarioId}`);
    return response.data;
};

export const createProyecto = async (proyectoData) => {
    const response = await axios.post(API_URL, proyectoData);
    return response.data;
};

export const deleteProyecto = async (proyectoId) => {
    const response = await axios.delete(`${API_URL}/${proyectoId}`);
    return response.data;
};