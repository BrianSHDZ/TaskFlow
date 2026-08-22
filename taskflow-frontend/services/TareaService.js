//version 6
import axios from 'axios';

const API_URL = 'http://10.0.2.2:8080/api/taskflow/tarea';

// Obtener tareas pendientes por usuario
export const getTareasPendientesPorUsuario = async (usuarioId) => {
    const response = await axios.get(`${API_URL}/usuario/${usuarioId}/estatus/PENDIENTE`);
    return response.data;
};
// Obtener tareas completadas (Historial)
export const getTareasCompletadasPorUsuario = async (usuarioId) => {
    const response = await axios.get(`${API_URL}/usuario/${usuarioId}/estatus/COMPLETADA`);
    return response.data;
};
// Ejemplo al crear tarea rápida o completa
export const createTareaRapida = async (tareaData) => {
    const response = await axios.post(`${API_URL}/rapida`, {
        titulo: tareaData.titulo,
        descripcion: tareaData.descripcion,
        estatus: tareaData.estatus,
        prioridad: tareaData.prioridad,
        vencimiento: tareaData.vencimiento,
        proyectoId: tareaData.proyectoId,
        asignadoA: tareaData.asignadoA,
        asignadoAInput: tareaData.asignadoAInput // El nombre o correo que escribió el usuario
    });
    return response.data;
};
// Finalizar/Completar Tarea
export const updateTareaStatus = async (tareaId) => {
    const response = await axios.patch(`${API_URL}/${tareaId}/finalizar`);
    return response.data;
};
// Eliminar Tarea
export const deleteTarea = async (tareaId) => {
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
// Crear Tarea asignada a un Proyecto
export const createTarea = async (tareaData) => {
    const response = await axios.post(`${API_URL}`, {
        titulo: tareaData.titulo,
        descripcion: tareaData.descripcion,
        estatus: tareaData.estatus,
        prioridad: tareaData.prioridad,
        vencimiento: tareaData.vencimiento,
        proyectoId: tareaData.proyectoId,
        asignadoA: tareaData.asignadoA,
        asignadoAInput: tareaData.asignadoAInput
    });
    return response.data;
};