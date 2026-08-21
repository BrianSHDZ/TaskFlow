package com.taskflow.taskflow.repository;

import com.taskflow.taskflow.entity.Proyecto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IProyectoRepository extends JpaRepository<Proyecto, Long> {
    List<Proyecto> findByCreadoPor(Long usuarioId);
    boolean existsByCreadoPor(Long usuarioId);
    List<Proyecto> findByCreadoPorAndEstatus(Long usuarioId, String estatus);
}
