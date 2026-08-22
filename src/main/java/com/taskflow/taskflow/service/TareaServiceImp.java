package com.taskflow.taskflow.service;

import com.taskflow.taskflow.entity.Proyecto;
import com.taskflow.taskflow.entity.RegistroTiempo;
import com.taskflow.taskflow.entity.Tarea;
import com.taskflow.taskflow.entity.Usuario;
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

    public TareaServiceImp(ITareaRepository tareaRepository,
                           IUsuarioRepository usuarioRepository,
                           IProyectoRepository proyectoRepository,
                           IRegistroTiempoRepository registroTiempoRepository) {
        this.tareaRepository = tareaRepository;
        this.usuarioRepository = usuarioRepository;
        this.proyectoRepository = proyectoRepository;
        this.registroTiempoRepository = registroTiempoRepository;
    }

    @Override
    public List<Tarea> listarTareas() {
        return tareaRepository.findAll();
    }

    @Override
    public Optional<Tarea> buscarTareasPorId(Long id) {
        return tareaRepository.findById(id);
    }

    @Override
    public List<Tarea> obtenerTareaPorProyectoId(Long proyectoId) {
        return tareaRepository.findByProyectoId(proyectoId);
    }

    @Override
    public List<Tarea> obtenerTareaPorAsignadoA(Long asignadoA) {
        return tareaRepository.findByAsignadoA(asignadoA);
    }

    @Override
    public Tarea guardarTarea(Tarea tarea) {

        if (tarea.getTitulo() == null || tarea.getTitulo().isBlank()) {
            throw new DatosInvalidosException("El título de la tarea es obligatorio");
        }
        // 2. Asigna estatus por defecto... (Tu código original)
        if (tarea.getEstatus() == null || tarea.getEstatus().isBlank()) {
            tarea.setEstatus("PENDIENTE");
        } else {
            validarEstatus(tarea.getEstatus());
        }
        // 3. Asigna prioridad por defecto...
        // Asegurar prioridad en mayúsculas por defecto
        if (tarea.getPrioridad() == null || tarea.getPrioridad().isBlank()) {
            tarea.setPrioridad("MEDIA");
        } else {
            validarPrioridad(tarea.getPrioridad());
            tarea.setPrioridad(tarea.getPrioridad().toUpperCase());
        }
        // 4. Solo valida el proyecto SI viene un proyectoId... (Tu código original)
        if (tarea.getProyectoId() != null && !proyectoRepository.existsById(tarea.getProyectoId())) {
            throw new ProyectoNotFoundException("El proyecto con id: " + tarea.getProyectoId() + " no existe");
        }
        // 5. Valida y resuelve usuario asignado (Soporta ID o Nombre/Correo de forma segura)
        Long idRealUsuario = resolverUsuarioAsignado(tarea.getAsignadoA(), tarea.getAsignadoAInput(), tarea.getProyectoId());
        tarea.setAsignadoA(idRealUsuario);

        return tareaRepository.save(tarea);
    }

    @Override
    public Tarea actualizarTarea(Long id, Tarea tareaActualizada) {
        Tarea tareaExistente = tareaRepository.findById(id)
                .orElseThrow(() -> new TareaNotFoundException("No se encontró la tarea con id: " + id));
        if (tareaActualizada.getProyectoId() != null && !proyectoRepository.existsById(tareaActualizada.getProyectoId())) {
            throw new ProyectoNotFoundException("El proyecto con id: " + tareaActualizada.getProyectoId() + " no existe");
        }
        // RESOLUCIÓN INTELIGENTE DEL USUARIO (Soporta ID numérico o Nombre/Correo al actualizar)
        Long idUsuarioReal = resolverUsuarioAsignado(tareaActualizada.getAsignadoA(), tareaActualizada.getAsignadoAInput(), tareaActualizada.getProyectoId());
        tareaExistente.setAsignadoA(idUsuarioReal);
        if ("COMPLETADA".equalsIgnoreCase(tareaExistente.getEstatus())) {
            throw new IllegalStateException("No se puede modificar una tarea que ya se encuentra completada");
        }
        if (tareaActualizada.getEstatus() != null) {
            validarEstatus(tareaActualizada.getEstatus());
            tareaExistente.setEstatus(tareaActualizada.getEstatus().toUpperCase());
        }
        // Bloque de actualización de prioridad
        if (tareaActualizada.getPrioridad() != null) {
            // Primero validamos que sea BAJA, MEDIA o ALTA
            validarPrioridad(tareaActualizada.getPrioridad());
            // Convertimos a mayúsculas y guardamos en la entidad existente
            tareaExistente.setPrioridad(tareaActualizada.getPrioridad().toUpperCase());
        }
        tareaExistente.setTitulo(tareaActualizada.getTitulo());
        tareaExistente.setDescripcion(tareaActualizada.getDescripcion());
        tareaExistente.setVencimiento(tareaActualizada.getVencimiento());
        tareaExistente.setProyectoId(tareaActualizada.getProyectoId());

        return tareaRepository.save(tareaExistente);
    }

    @Override
    public void eliminarTarea(Long id) {
        if (!tareaRepository.existsById(id)) {
            throw new TareaNotFoundException("No existe la tarea con id: " + id);
        }
        tareaRepository.deleteById(id);
    }

    @Override
    public Tarea finalizarTarea(Long id) {
        Tarea tarea = tareaRepository.findById(id)
                .orElseThrow(() -> new TareaNotFoundException("No se encontró la tarea con id: " + id));

        if ("COMPLETADA".equalsIgnoreCase(tarea.getEstatus())) {
            throw new IllegalStateException("La tarea con id " + id + " ya se encuentra completada");
        }

        tarea.setEstatus("COMPLETADA");

        List<RegistroTiempo> tiempos = registroTiempoRepository.findByTareaId(id);
        for (RegistroTiempo tiempo : tiempos) {
            if (tiempo.getTerminadoTiempo() == null) {
                tiempo.setTerminadoTiempo(LocalDateTime.now());
                registroTiempoRepository.save(tiempo);
            }
        }
        return tareaRepository.save(tarea);
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

        return tareaRepository.findByAsignadoAYEstatusOrdenadas(asignadoA, estatus.toUpperCase());
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

    private void validarPrioridad(String prioridad) {
        if (prioridad == null) {
            throw new IllegalArgumentException("La prioridad no puede ser nula");
        }
        String prioridadUpper = prioridad.toUpperCase();
        if (!prioridadUpper.equals("ALTA") && !prioridadUpper.equals("MEDIA") && !prioridadUpper.equals("BAJA")) {
            throw new IllegalArgumentException("Prioridad no válida. Los valores permitidos son: ALTA, MEDIA, BAJA");
        }
    }

    private Long resolverUsuarioAsignado(Long asignadoAId, String asignadoAInput, Long proyectoId) {
        // 1. Si viene un ID numérico directo de la sugerencia
        if (asignadoAId != null) {
            if (!usuarioRepository.existsById(asignadoAId)) {
                throw new UsuarioNotFoundException("El usuario asignado no existe");
            } return asignadoAId;
        }
        // 2. Si viene texto (nombre de usuario o correo desde el input)
        if (asignadoAInput != null && !asignadoAInput.isBlank()) {
            String input = asignadoAInput.trim();
            Usuario usuario = usuarioRepository.findByCorreo(input).orElseGet(() -> usuarioRepository.findByNombreUsuarioIgnoreCase(input).orElse(null));
            if (usuario != null) {
                return usuario.getId();
            } throw new UsuarioNotFoundException("El usuario asignado no existe");
        }
        // 3. SI SE DEJA VACÍO: Auto-asignación inteligente
        // Si la tarea pertenece a un proyecto, se la asignamos automáticamente al creador del proyecto:
        if (proyectoId != null) {
            Proyecto proyecto = proyectoRepository.findById(proyectoId).orElse(null);
            if (proyecto != null && proyecto.getCreadoPor() != null) {
                return proyecto.getCreadoPor();
            }
        }
        // Si es una tarea rápida (sin proyecto) o no se encontró creador, se asigna por defecto al usuario 1
        return 1L;
    }
}
