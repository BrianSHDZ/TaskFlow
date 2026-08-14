import api from './api';

export const iniciarRegistroTiempo = async (tareaId, usuarioId) => {
    try {
        // Agregamos /taskflow antes de /registrotiempo para que coincida con el Controller
        const response = await api.post(`/taskflow/registrotiempo/iniciar`, null, {
            params: {
                tareaId,
                usuarioId
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al iniciar el registro de tiempo:', error.response?.data || error.message);
        throw error;
    }
};

export const detenerRegistroTiempo = async (id) => {
    try {
        const response = await api.patch(`/taskflow/registrotiempo/${id}/detener`);
        return response.data;
    } catch (error) {
        console.error('Error al detener el registro de tiempo:', error.response?.data || error.message);
        throw error;
    }
};

export const obtenerRegistrosPorTarea = async (tareaId) => {
    try {
        const response = await api.get(`/taskflow/registrotiempo/tarea/${tareaId}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener registros por tarea:', error.response?.data || error.message);
        throw error;
    }
};