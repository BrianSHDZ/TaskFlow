package com.taskflow.taskflow.service;

import com.taskflow.taskflow.entity.RegistroTiempo;

import java.util.List;

public interface IRegistroTiempoService {
    RegistroTiempo iniciarTiempo(Long tareaId, Long usuarioId);

    RegistroTiempo detenerTiempo(Long registroId);

    List<RegistroTiempo> obtenerTiempoPorTareaId(Long tareaId);

    List<RegistroTiempo> obtenerTiempoPorUsuarioId(Long usuarioId);
}
