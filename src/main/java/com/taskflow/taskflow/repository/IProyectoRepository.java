package com.taskflow.taskflow.repository;

import com.taskflow.taskflow.dto.ProyectoDTO;
import com.taskflow.taskflow.entity.Proyecto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IProyectoRepository extends JpaRepository<Proyecto, Long> {
    List<Proyecto> findByCreadoPor(Long usuarioId);
    boolean existsByCreadoPor(Long usuarioId);
    List<Proyecto> findByCreadoPorAndEstatus(Long usuarioId, String estatus);
    @Query("SELECT new com.taskflow.taskflow.dto.ProyectoDTO(" + "p.id, p.titulo, p.descripcion, p.creadoPor, " +
            "COUNT(t.id), " + "COALESCE(SUM(CASE WHEN t.estatus = 'COMPLETADA' THEN 1L ELSE 0L END), 0L)) " +
            "FROM Proyecto p LEFT JOIN Tarea t ON p.id = t.proyectoId " + "WHERE p.creadoPor = :usuarioId AND p.estatus = 'ACTIVO' " +
            "GROUP BY p.id, p.titulo, p.descripcion, p.creadoPor")
    List<ProyectoDTO> obtenerProyectosConConteoPorUsuarioOptimizada(@Param("usuarioId") Long usuarioId);
}
