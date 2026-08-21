import API from './api';

// Petición de inicio de sesión mapeada con los nombres correctos del backend
export const loginUser = async (credentials) => {
    try {
        const response = await API.post('/auth/login', {
            correo: credentials.email,
            contrasena: credentials.password,
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};
// Petición de registro de usuario
export const registerUser = async (userData) => {
    try {
        // Agregamos /taskflow para que la ruta final completa sea /api/taskflow/usuario
        const response = await API.post('/taskflow/usuario', userData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};