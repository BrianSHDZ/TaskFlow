package com.taskflow.taskflow.repository;

import com.taskflow.taskflow.entity.RegistroTiempo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IRegistroTiempoRepository extends JpaRepository<RegistroTiempo, Long> {
    List<RegistroTiempo> findByTareaId(Long tareaId);
    List<RegistroTiempo> findByUsuarioId(Long usuarioId);
}
