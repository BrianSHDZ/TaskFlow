package com.taskflow.taskflow.service;

import com.taskflow.taskflow.dto.ProyectoDTO;
import com.taskflow.taskflow.entity.Proyecto;
import com.taskflow.taskflow.entity.Tarea;
import com.taskflow.taskflow.exception.DatosInvalidosException;
import com.taskflow.taskflow.exception.ProyectoNotFoundException;
import com.taskflow.taskflow.exception.ProyectoWithTareaException;
import com.taskflow.taskflow.exception.UsuarioNotFoundException;
import com.taskflow.taskflow.repository.IProyectoRepository;
import com.taskflow.taskflow.repository.ITareaRepository;
import com.taskflow.taskflow.repository.IUsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProyectoServiceImp implements IProyectoService{

    private final IProyectoRepository proyectoRepository;
    private final IUsuarioRepository usuarioRepository;
    private final ITareaRepository tareaRepository;

    public ProyectoServiceImp(IProyectoRepository proyectoRepository, IUsuarioRepository usuarioRepository, ITareaRepository tareaRepository) {
        this.proyectoRepository = proyectoRepository;
        this.usuarioRepository = usuarioRepository;
        this.tareaRepository = tareaRepository;
    }

    @Override
    public List<Proyecto> listarProyectos() { return proyectoRepository.findAll(); }

    @Override
    public Proyecto guardarProyecto(Proyecto proyecto) {
        //valida que el nombre del proyecto no esté vacío
        if (proyecto.getTitulo() == null || proyecto.getTitulo().isBlank()) {
            throw new DatosInvalidosException("El nombre del proyecto es obligatorio");
        }
        //valida que el usuario creador exista
        if (proyecto.getCreadoPor() == null || !usuarioRepository.existsById(proyecto.getCreadoPor())) {
            throw new UsuarioNotFoundException("El usuario asignado al proyecto no existe");
        } return proyectoRepository.save(proyecto);
    }

    @Override
    public Proyecto obtenerProyectoPorId(Long id) {
        return proyectoRepository.findById(id).orElseThrow(() -> new ProyectoNotFoundException("No se encontro el proyecto con id: "+ id));
    }

    @Override
    public List<Proyecto> obtenerProyectoPorUsuario(Long usuarioId) {
        if(usuarioId==null || !usuarioRepository.existsById(usuarioId)) {
            throw new UsuarioNotFoundException("El usuario no existe");
        }return proyectoRepository.findByCreadoPor(usuarioId);
    }

    @Override
    public Proyecto actualizarProyecto(Long id, Proyecto proyecto) {
        //verifica si el proyecto existe
        Proyecto proyectoActual = proyectoRepository.findById(id)
                .orElseThrow(() -> new ProyectoNotFoundException("El proyecto con id " + id + " no existe"));
        //actualiza nombre si tiene modificacion
        if (proyecto.getTitulo() != null && !proyecto.getTitulo().isBlank()) {
            proyectoActual.setTitulo(proyecto.getTitulo());
        }
        //actualiza descripción si tiene modificacion
        if (proyecto.getDescripcion() != null) {
            proyectoActual.setDescripcion(proyecto.getDescripcion());
        }
        //actualiza usuario creador si asi se desea y se modifica y existe
        if (proyecto.getCreadoPor() != null) {
            if (!usuarioRepository.existsById(proyecto.getCreadoPor())) {
                throw new UsuarioNotFoundException("El usuario con id " + proyecto.getCreadoPor() + " no existe");
            } proyectoActual.setCreadoPor(proyecto.getCreadoPor());
        } return proyectoRepository.save(proyectoActual);
    }

    @Override
    public void eliminarProyecto(Long id) {
        Proyecto proyecto = obtenerProyectoPorId(id);
        if(tareaRepository.existsByProyectoId(id)){
            throw new ProyectoWithTareaException("No se puede eliminar el proyecto porque tiene tareas asociadas. Elimina o reasigna las tareas");
        }
        proyectoRepository.delete(proyecto);
    }

    @Override
    public List<ProyectoDTO> obtenerProyectosConConteoPorUsuario(Long usuarioId) {
        List<Proyecto> proyectos = proyectoRepository.findByCreadoPor(usuarioId);
        List<ProyectoDTO> dtos = new ArrayList<>();

        for (Proyecto p : proyectos) {
            List<Tarea> tareasDelProyecto = tareaRepository.findByProyectoId(p.getId());

            long total = tareasDelProyecto.size();
            long completadas = tareasDelProyecto.stream()
                    .filter(t -> "COMPLETADA".equalsIgnoreCase(t.getEstatus()))
                    .count();
            dtos.add(new ProyectoDTO(
                    p.getId(),
                    p.getTitulo(),
                    p.getDescripcion(),
                    p.getCreadoPor(),
                    total,
                    completadas
            ));
        } return dtos;
    }
}
