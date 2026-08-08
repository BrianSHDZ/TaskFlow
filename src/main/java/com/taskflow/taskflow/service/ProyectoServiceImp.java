package com.taskflow.taskflow.service;

import com.taskflow.taskflow.entity.Proyecto;
import com.taskflow.taskflow.exception.ProyectoNotFoundException;
import com.taskflow.taskflow.exception.UsuarioNotFoundException;
import com.taskflow.taskflow.repository.IProyectoRepository;
import com.taskflow.taskflow.repository.IUsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProyectoServiceImp implements IProyectoService{

    private final IProyectoRepository proyectoRepository;
    private final IUsuarioRepository usuarioRepository;

    public ProyectoServiceImp(IProyectoRepository proyectoRepository, IUsuarioRepository usuarioRepository) {
        this.proyectoRepository = proyectoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public List<Proyecto> listarProyectos() { return proyectoRepository.findAll(); }

    @Override
    public Proyecto guardarProyecto(Proyecto proyecto) {
        if(proyecto.getCreadoPor()==null || !usuarioRepository.existsById(proyecto.getCreadoPor())) {
            throw new UsuarioNotFoundException("El usuario no existe");
        }return proyectoRepository.save(proyecto);
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
        Proyecto proyectoExistente = obtenerProyectoPorId(id);

        if(proyecto.getCreadoPor()==null || !usuarioRepository.existsById(proyecto.getCreadoPor())) {
            throw new UsuarioNotFoundException("El usuario no existe");
        }

        proyecto.setTitulo(proyecto.getTitulo());
        proyecto.setDescripcion(proyecto.getDescripcion());
        proyecto.setCreadoPor(proyecto.getCreadoPor());
        return proyectoRepository.save(proyectoExistente);
    }

    @Override
    public void eliminarProyecto(Long id) {
        Proyecto proyecto = obtenerProyectoPorId(id);
        proyectoRepository.delete(proyecto);
    }
}
