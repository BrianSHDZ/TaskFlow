package com.taskflow.taskflow.service;

import com.taskflow.taskflow.entity.RegistroTiempo;
import com.taskflow.taskflow.exception.RegistroTiempoNotFoundException;
import com.taskflow.taskflow.exception.TareaNotFoundException;
import com.taskflow.taskflow.exception.UsuarioNotFoundException;
import com.taskflow.taskflow.repository.IRegistroTiempoRepository;
import com.taskflow.taskflow.repository.ITareaRepository;
import com.taskflow.taskflow.repository.IUsuarioRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RegistroTiempoImp implements IRegistroTiempoService {

    private final IRegistroTiempoRepository registroTiempoRepository;
    private final ITareaRepository tareaRepository;
    private final IUsuarioRepository usuarioRepository;

    public RegistroTiempoImp(IRegistroTiempoRepository registroTiempoRepository, ITareaRepository tareaRepository, IUsuarioRepository usuarioRepository) {
        this.registroTiempoRepository = registroTiempoRepository;
        this.tareaRepository = tareaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public RegistroTiempo iniciarTiempo(Long tareaId, Long usuarioId) {
        if(!tareaRepository.existsById(tareaId)){
            throw new TareaNotFoundException("Tarea no encontrada");
        }
        if(!usuarioRepository.existsById(usuarioId)){
            throw new UsuarioNotFoundException("Usuario no encontrado");
        }
        RegistroTiempo registro = new RegistroTiempo();

        registro.setTareaId(tareaId);
        registro.setUsuarioId(usuarioId);
        registro.setInicioTiempo(LocalDateTime.now());
        return registroTiempoRepository.save(registro);
    }

    @Override
    public RegistroTiempo detenerTiempo(Long registroId) {
        RegistroTiempo registro = registroTiempoRepository.findById(registroId).orElseThrow(() -> new RegistroTiempoNotFoundException("No se encontro el registro de tiempo con id: " + registroId));
        if (registro.getTerminadoTiempo() != null) {
            throw new IllegalStateException("El registro de tiempo con id " + registroId + " ya fue detenido anteriormente");
        }
        registro.setTerminadoTiempo(LocalDateTime.now());
        return registroTiempoRepository.save(registro);
    }

    @Override
    public List<RegistroTiempo> obtenerTiempoPorTareaId(Long tareaId) {
        //validamos que la tarea exista
        if(!tareaRepository.existsById(tareaId)){
            throw new TareaNotFoundException("Tarea no encontrada");
        }
        return registroTiempoRepository.findByTareaId(tareaId);
    }

    @Override
    public List<RegistroTiempo> obtenerTiempoPorUsuarioId(Long usuarioId) {
        //validamos que el usuario exista
        if(!usuarioRepository.existsById(usuarioId)){
            throw new UsuarioNotFoundException("Usuario no encontrado");
        }
        return registroTiempoRepository.findByUsuarioId(usuarioId);
    }
}
