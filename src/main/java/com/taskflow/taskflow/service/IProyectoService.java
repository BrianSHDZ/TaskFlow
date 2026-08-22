package com.taskflow.taskflow.service;

import com.taskflow.taskflow.dto.ProyectoDTO;
import com.taskflow.taskflow.entity.Proyecto;
import com.taskflow.taskflow.entity.Rol;

import java.util.List;

public interface IProyectoService {
    List<Proyecto> listarProyectos();

    Proyecto guardarProyecto(Proyecto proyecto);

    Proyecto obtenerProyectoPorId(Long id);

    List<Proyecto> obtenerProyectoPorUsuario(Long usuarioId);

    Proyecto actualizarProyecto(Long id, Proyecto proyecto, String correoUsuarioAutenticado);

    void eliminarProyecto(Long id, String correoUsuarioAutenticado);

    List<ProyectoDTO> obtenerProyectosConConteoPorUsuario(Long usuarioId);

    List<Proyecto> obtenerProyectosCompletados(Long usuarioId);
}
