package com.taskflow.taskflow.repository;

import com.taskflow.taskflow.entity.Tarea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ITareaRepository extends JpaRepository<Tarea, Long> {
    List<Tarea> findByProyectoId(Long proyectoId);
    List<Tarea> findByAsignadoA(Long asignadoA);
    boolean existsByProyectoId(Long proyectoId);
    List<Tarea> findByEstatusIgnoreCase(String estatus);
    List<Tarea> findByAsignadoAAndEstatusIgnoreCase(Long asignadoA, String estatus);

    @Query("SELECT t FROM Tarea t WHERE t.asignadoA = :asignadoA AND UPPER(t.estatus) = UPPER(:estatus) " +
            "ORDER BY CASE UPPER(t.prioridad) WHEN 'ALTA' THEN 1 WHEN 'MEDIA' THEN 2 WHEN 'BAJA' THEN 3 ELSE 4 END")
    List<Tarea> findByAsignadoAYEstatusOrdenadas(@Param("asignadoA") Long asignadoA, @Param("estatus") String estatus);
}
