//version 2
import axios from 'axios';

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

export const updateProyectoStatus = async (proyectoId, estatus) => {
    const response = await axios.put(`${API_URL}/${proyectoId}/estatus`, null, {
        params: { estatus: estatus }
    });
    return response.data;
};

export const getProyectosCompletadosPorUsuario = async (usuarioId) => {
    const response = await axios.get(`${API_URL}/usuario/${usuarioId}/completados`);
    return response.data;
};