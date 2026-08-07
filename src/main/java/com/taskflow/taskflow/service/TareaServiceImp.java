package com.taskflow.taskflow.service;

import com.taskflow.taskflow.entity.Tarea;
import com.taskflow.taskflow.exception.TareaNotFoundException;
import com.taskflow.taskflow.exception.UsuarioNotFoundException;
import com.taskflow.taskflow.repository.IProyectoRepository;
import com.taskflow.taskflow.repository.ITareaRepository;
import com.taskflow.taskflow.repository.IUsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TareaServiceImp implements ITareaService {

    private final ITareaRepository tareaRepository;
    private final IUsuarioRepository usuarioRepository;
    private final IProyectoRepository proyectoRepository;

    public TareaServiceImp(ITareaRepository tareaRepository, IUsuarioRepository usuarioRepository, IProyectoRepository proyectoRepository)
    {
      this.tareaRepository = tareaRepository;
      this.usuarioRepository = usuarioRepository;
      this.proyectoRepository = proyectoRepository;
    }

    @Override
    public List<Tarea> listarTareas() { return tareaRepository.findAll(); }

    /*@Override
    public Optional<Tarea> buscarTareasPorId(Long id) {
        return tareaRepository.findById(id);
    }*/

    @Override
    public List<Tarea> obtenerTareaPorProyectoId(Long ProyectoId) { return tareaRepository.findByProyectoId(ProyectoId); }

    @Override
    public List<Tarea> obtenerTareaPorAsignadoA(Long asignadoA) { return tareaRepository.findByAsignadoA(asignadoA); }

    @Override
    public Tarea guardarTarea(Tarea tarea) {
        //el proyecto debe existir y aqui validamos eso
        if(tarea.getProyectoId()==null || !proyectoRepository.existsById(tarea.getProyectoId())) {
            throw new IllegalArgumentException("El proyecto no existe");
        }
        //el usuario debe existir y aqui validamos eso
        if(tarea.getAsignadoA()!=null && !usuarioRepository.existsById(tarea.getAsignadoA())) {
            throw new UsuarioNotFoundException("El usuario asignado no existe");
        }return tareaRepository.save(tarea);
    }

    @Override
    public Tarea actualizarTarea(Long id, Tarea tareaActualizada) {
        //validamos exista la tarea antes de modificar si no manda ese error
        Tarea tareaExistente = tareaRepository.findById(id).orElseThrow(() -> new TareaNotFoundException("No se encontro la tarea con id: "+ id));

        //validamos exista el proyecto nuevamente
        if(tareaActualizada.getProyectoId()==null || !proyectoRepository.existsById(tareaActualizada.getProyectoId())) {
            throw new IllegalArgumentException("El proyecto no existe");
        }
        //aqui condicionamos que el usuario asignado debe existir
        if(tareaActualizada.getAsignadoA()!=null && !usuarioRepository.existsById(tareaActualizada.getAsignadoA())) {
            throw new UsuarioNotFoundException("El usuario asignado no existe");
        }

        tareaExistente.setTitulo(tareaActualizada.getTitulo());
        tareaExistente.setDescripcion(tareaActualizada.getDescripcion());
        tareaExistente.setEstatus(tareaActualizada.getEstatus());
        tareaExistente.setPrioridad(tareaActualizada.getPrioridad());
        tareaExistente.setVencimiento(tareaActualizada.getVencimiento());
        tareaExistente.setProyectoId(tareaActualizada.getProyectoId());
        tareaExistente.setAsignadoA(tareaActualizada.getAsignadoA());

        return tareaRepository.save(tareaExistente);
    }

    @Override
    public void eliminarTarea(Long id) {
        if(!tareaRepository.existsById(id)){
            throw new TareaNotFoundException("No existe la tarea con id: "+ id);
        }tareaRepository.deleteById(id);
    }
}
