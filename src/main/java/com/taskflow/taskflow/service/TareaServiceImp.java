package com.taskflow.taskflow.service;

import com.taskflow.taskflow.entity.RegistroTiempo;
import com.taskflow.taskflow.entity.Tarea;
import com.taskflow.taskflow.exception.DatosInvalidosException;
import com.taskflow.taskflow.exception.ProyectoNotFoundException;
import com.taskflow.taskflow.exception.TareaNotFoundException;
import com.taskflow.taskflow.exception.UsuarioNotFoundException;
import com.taskflow.taskflow.repository.IProyectoRepository;
import com.taskflow.taskflow.repository.IRegistroTiempoRepository;
import com.taskflow.taskflow.repository.ITareaRepository;
import com.taskflow.taskflow.repository.IUsuarioRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TareaServiceImp implements ITareaService {

    private final ITareaRepository tareaRepository;
    private final IUsuarioRepository usuarioRepository;
    private final IProyectoRepository proyectoRepository;
    private final IRegistroTiempoRepository registroTiempoRepository;

    public TareaServiceImp(ITareaRepository tareaRepository, IUsuarioRepository usuarioRepository, IProyectoRepository proyectoRepository, IRegistroTiempoRepository registroTiempoRepository)
    {
      this.tareaRepository = tareaRepository;
      this.usuarioRepository = usuarioRepository;
      this.proyectoRepository = proyectoRepository;
        this.registroTiempoRepository = registroTiempoRepository;
    }

    @Override
    public List<Tarea> listarTareas() { return tareaRepository.findAll(); }

    @Override
    public Optional<Tarea> buscarTareasPorId(Long id) {
        return tareaRepository.findById(id);
    }

    @Override
    public List<Tarea> obtenerTareaPorProyectoId(Long ProyectoId) { return tareaRepository.findByProyectoId(ProyectoId); }

    @Override
    public List<Tarea> obtenerTareaPorAsignadoA(Long asignadoA) { return tareaRepository.findByAsignadoA(asignadoA); }

    @Override
    public Tarea guardarTarea(Tarea tarea) {
        // Valida título obligatorio
        if (tarea.getTitulo() == null || tarea.getTitulo().isBlank()) {
            throw new DatosInvalidosException("El título de la tarea es obligatorio");
        } validarEstatus(tarea.getEstatus());

        // Solo valida el proyecto SI viene un proyectoId (si es null, lo ignora)
        if (tarea.getProyectoId() != null && !proyectoRepository.existsById(tarea.getProyectoId())) {
            throw new ProyectoNotFoundException("El proyecto con id: " + tarea.getProyectoId() + " no existe");
        }

        // Valida usuario asignado si viene presente
        if (tarea.getAsignadoA() != null && !usuarioRepository.existsById(tarea.getAsignadoA())) {
            throw new UsuarioNotFoundException("El usuario asignado no existe");
        } return tareaRepository.save(tarea);
    }

    @Override
    public Tarea actualizarTarea(Long id, Tarea tareaActualizada) {
        //validamos exista la tarea antes de modificar si no manda ese error
        Tarea tareaExistente = tareaRepository.findById(id).orElseThrow(() -> new TareaNotFoundException("No se encontro la tarea con id: "+ id));

        //validamos exista el proyecto nuevamente
        if (tareaActualizada.getProyectoId() != null && !proyectoRepository.existsById(tareaActualizada.getProyectoId())) {
            throw new ProyectoNotFoundException("El proyecto con id: " + tareaActualizada.getProyectoId() + " no existe");
        }
        //aqui condicionamos que el usuario asignado debe existir
        if(tareaActualizada.getAsignadoA()!=null && !usuarioRepository.existsById(tareaActualizada.getAsignadoA())) {
            throw new UsuarioNotFoundException("El usuario asignado no existe");
        }
        //si ya esta completada no se puede modificar
        if("COMPLETADA".equalsIgnoreCase(tareaExistente.getEstatus())) {
            throw new IllegalStateException("No se puede modificar una tarea que ya se encuentra completada");
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

    @Override
    public Tarea finalizarTarea(Long id) {
        Tarea tarea = tareaRepository.findById(id)
                .orElseThrow(() -> new TareaNotFoundException("No se encontro la tarea con id: " + id));
        if ("COMPLETADA".equalsIgnoreCase(tarea.getEstatus())) {
            throw new IllegalStateException("La tarea con id " + id + " ya se encuentra completada");
        }
        //Cambia el estado de la tarea
        tarea.setEstatus("COMPLETADA");

        //Si hay un registro de tiempo activo en esta tarea sin 'terminadoTiempo', lo cierras
        List<RegistroTiempo> tiempos = registroTiempoRepository.findByTareaId(id);
        for (RegistroTiempo tiempo : tiempos) {
            if (tiempo.getTerminadoTiempo() == null) {
                tiempo.setTerminadoTiempo(LocalDateTime.now());
                registroTiempoRepository.save(tiempo);
            }
        }return tareaRepository.save(tarea);
    }

    @Override
    public List<Tarea> obtenerTareasPorEstatus(String estatus) {
        return tareaRepository.findByEstatusIgnoreCase(estatus);
    }

    @Override
    public List<Tarea> obtenerTareasPorAsignadoYEstatus(Long asignadoA, String estatus) {
        if (!usuarioRepository.existsById(asignadoA)) {
            throw new UsuarioNotFoundException("No existe el usuario con id: " + asignadoA);
        }
        return tareaRepository.findByAsignadoAAndEstatusIgnoreCase(asignadoA, estatus);
    }

    private void validarEstatus(String estatus) {
        if (estatus == null) {
            throw new IllegalArgumentException("El estatus no puede ser nulo");
        }
        String estatusUpper = estatus.toUpperCase();
        if (!estatusUpper.equals("PENDIENTE") && !estatusUpper.equals("EN_CURSO") && !estatusUpper.equals("COMPLETADA")) {
            throw new IllegalArgumentException("Estatus no válido. Los valores permitidos son: PENDIENTE, EN_CURSO, COMPLETADA");
        }
    }
}
