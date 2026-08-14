//version 6
import axios from 'axios';

// Base general definida en tu @RequestMapping
const API_URL = 'http://10.0.2.2:8080/api/taskflow/tarea';

// Obtener tareas pendientes por usuario
export const getTareasPendientesPorUsuario = async (usuarioId) => {
    // Coincide con: GET /api/taskflow/tarea/usuario/{usuarioId}/estatus/{estatus}
    const response = await axios.get(`${API_URL}/usuario/${usuarioId}/estatus/PENDIENTE`);
    return response.data;
};

// Obtener tareas completadas (Historial)
export const getTareasCompletadasPorUsuario = async (usuarioId) => {
    // Coincide con: GET /api/taskflow/tarea/usuario/{usuarioId}/estatus/{estatus}
    // Si usas 'COMPLETADA' o 'FINALIZADA', asegúrate de pasar la cadena que maneje tu BD
    const response = await axios.get(`${API_URL}/usuario/${usuarioId}/estatus/COMPLETADA`);
    return response.data;
};

// Crear Tarea Rápida
/*export const createTareaRapida = async (tareaData) => {
    // Coincide con: POST /api/taskflow/tarea/rapida
    const response = await axios.post(`${API_URL}/rapida`, tareaData);
    return response.data;
};*/
// Ejemplo al crear tarea rápida o completa
export const createTareaRapida = async (tareaData) => {
    const response = await axios.post(`${API_URL}/rapida`, {
        titulo: tareaData.titulo,
        descripcion: tareaData.descripcion,
        estatus: tareaData.estatus,
        prioridad: tareaData.prioridad,
        vencimiento: tareaData.vencimiento,
        proyectoId: tareaData.proyectoId,
        asignadoA: tareaData.asignadoA,       // Puede ser null/undefined si usas texto
        asignadoAInput: tareaData.asignadoAInput // El nombre o correo que escribió el usuario
    });
    return response.data;
};

// Finalizar/Completar Tarea
export const updateTareaStatus = async (tareaId) => {
    // Coincide con: PATCH /api/taskflow/tarea/{id}/finalizar
    const response = await axios.patch(`${API_URL}/${tareaId}/finalizar`);
    return response.data;
};
// Eliminar Tarea
export const deleteTarea = async (tareaId) => {
    // Coincide con: DELETE /api/taskflow/tarea/{id}
    const response = await axios.delete(`${API_URL}/${tareaId}`);
    return response.data;
};
// Obtener tareas asociadas a un proyecto específico
export const getTareasPorProyecto = async (proyectoId) => {
    try {
        const response = await fetch(`http://10.0.2.2:8080/api/taskflow/tarea/proyecto/${proyectoId}`);
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        return await response.json();
    } catch (error) {
        console.error("Error en getTareasPorProyecto:", error);
        throw error;
    }
};
// Actualizar tarea completa (Líder)
export const updateTareaCompleta = async (tareaId, tareaData) => {
    try {
        const response = await fetch(`http://10.0.2.2:8080/api/taskflow/tarea/${tareaId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tareaData),
        });
        if (!response.ok) throw new Error('Error al actualizar la tarea');
        return await response.json();
    } catch (error) {
        console.error("Error en updateTareaCompleta:", error);
        throw error;
    }
};