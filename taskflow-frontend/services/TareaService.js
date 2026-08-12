/*import API from './api';

// Obtener todas las tareas
export const getTareas = async () => {
    try {
        const response = await API.get('/tareas');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

// Crear una nueva tarea
export const createTarea = async (tareaData) => {
    try {
        const response = await API.post('/tareas', tareaData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

// Eliminar tarea
export const deleteTarea = async (id) => {
    try {
        const response = await API.delete(`/tareas/${id}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};*/
//version 2
import API from './api';

// Obtener tareas por ID de usuario
export const getTareasPorUsuario = async (usuarioId) => {
    try {
        const response = await API.get(`/taskflow/tarea/usuario/${usuarioId}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

// Crear tarea enviando los campos obligatorios del backend
export const createTarea = async (tareaData) => {
    try {
        const response = await API.post('/taskflow/tarea', tareaData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

// Crear Tarea Rápida (Sin proyecto)
export const createTareaRapida = async (tareaData) => {
    try {
        const response = await API.post('/taskflow/tarea/rapida', tareaData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

// Eliminar tarea
export const deleteTarea = async (id) => {
    try {
        const response = await API.delete(`/taskflow/tarea/${id}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};