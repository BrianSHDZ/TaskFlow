package com.taskflow.taskflow.service;

import com.taskflow.taskflow.entity.Tarea;

import java.util.List;
import java.util.Optional;

public interface ITareaService {
    List<Tarea> listarTareas();

    Optional<Tarea> buscarTareasPorId(Long id);

    List<Tarea> obtenerTareaPorProyectoId(Long ProyectoId);

    List<Tarea> obtenerTareaPorAsignadoA(Long asignadoA);

    Tarea guardarTarea(Tarea tarea);

    Tarea actualizarTarea(Long id, Tarea tareaActualizada);

    void eliminarTarea(Long id, String correoUsuarioAutenticado);

    Tarea finalizarTarea(Long id);

    List<Tarea> obtenerTareasPorEstatus(String estatus);

    List<Tarea> obtenerTareasPorAsignadoYEstatus(Long asignadoA, String estatus);
}
