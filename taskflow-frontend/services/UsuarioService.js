import axios from 'axios';

const API_URL = 'http://10.0.2.2:8080/api/taskflow';

export const searchUsuarios = async (query) => {
    try {
        const response = await fetch(`${API_URL}/buscar?query=${encodeURIComponent(query)}`);

        if (!response.ok) {
            // Esto revelará si es un 404 (ruta) o un 500 (base de datos/java)
            const errorText = await response.text();
            console.error(`Status Backend: ${response.status} | Detalle:`, errorText);
            throw new Error(`El servidor falló con status ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error en searchUsuarios:", error);
        throw error;
    }
};