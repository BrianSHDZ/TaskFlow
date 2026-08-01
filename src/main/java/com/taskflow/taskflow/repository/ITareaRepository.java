package com.taskflow.taskflow.repository;

import com.taskflow.taskflow.entity.Tarea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ITareaRepository extends JpaRepository<Tarea, Long> {
    List<Tarea> findByProyectoId(Long proyectoId);
    List<Tarea> findByAsignadoA(Long asignadoA);
}
