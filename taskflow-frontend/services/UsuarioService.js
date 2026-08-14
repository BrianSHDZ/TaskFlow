import axios from 'axios';

// Apunta a la base correcta sin anteponer /usuario
const API_URL = 'http://10.0.2.2:8080/taskflow';

export const searchUsuarios = async (query) => {
    try {
        const response = await fetch(`${API_URL}/buscar?query=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Error al buscar usuarios');
        return await response.json();
    } catch (error) {
        console.error("Error en searchUsuarios:", error);
        throw error;
    }
};