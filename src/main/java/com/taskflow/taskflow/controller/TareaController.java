package com.taskflow.taskflow.controller;

import com.taskflow.taskflow.entity.Tarea;
import com.taskflow.taskflow.exception.TareaNotFoundException;
import com.taskflow.taskflow.service.ITareaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/taskflow")
@CrossOrigin(origins = "*")
public class TareaController {

    private final ITareaService tareaService;

    public TareaController(ITareaService tareaService) {
        this.tareaService = tareaService;
    }

    @GetMapping("/tarea")
    @PreAuthorize("hasAnyRole('MIEMBRO', 'LIDER', 'ADMIN')")
    public ResponseEntity<List<Tarea>> listaTareas() {
        return ResponseEntity.ok(tareaService.listarTareas());
    }

    @GetMapping("/tarea/{id}")
    @PreAuthorize("hasAnyRole('MIEMBRO', 'LIDER', 'ADMIN')")
    public ResponseEntity<Tarea> obtenerTareaPorId(@PathVariable Long id) {
        Tarea tarea = tareaService.buscarTareasPorId(id)
                .orElseThrow(() -> new TareaNotFoundException("No se encontró la tarea con id: " + id));
        return ResponseEntity.ok(tarea);
    }

    @GetMapping("/tarea/estatus/{estatus}")
    @PreAuthorize("hasAnyRole('MIEMBRO', 'LIDER', 'ADMIN')")
    public ResponseEntity<List<Tarea>> obtenerTareasPorEstatus(@PathVariable String estatus) {
        return ResponseEntity.ok(tareaService.obtenerTareasPorEstatus(estatus));
    }

    // Buscar por asignado y estatus (ej: /taskflow/tarea/usuario/1/estatus/EN_CURSO)
    @GetMapping("/tarea/usuario/{usuarioId}/estatus/{estatus}")
    @PreAuthorize("hasAnyRole('MIEMBRO', 'LIDER', 'ADMIN')")
    public ResponseEntity<List<Tarea>> obtenerTareasPorAsignadoYEstatus(@PathVariable Long usuarioId, @PathVariable String estatus) {
        return ResponseEntity.ok(tareaService.obtenerTareasPorAsignadoYEstatus(usuarioId, estatus));
    }

    @GetMapping("/tarea/proyecto/{proyectoId}")
    @PreAuthorize("hasAnyRole('MIEMBRO', 'LIDER', 'ADMIN')")
    public ResponseEntity<List<Tarea>> obtenerTareasPorProyecto(@PathVariable Long proyectoId) {
        return ResponseEntity.ok(tareaService.obtenerTareaPorProyectoId(proyectoId));
    }

    @GetMapping("/tarea/usuario/{asignadoA}")
    @PreAuthorize("hasAnyRole('MIEMBRO', 'LIDER', 'ADMIN')")
    public ResponseEntity<List<Tarea>> obtenerTareaPorAsignadoA(@PathVariable Long asignadoA) {
        return ResponseEntity.ok(tareaService.obtenerTareaPorAsignadoA(asignadoA));
    }

    @PostMapping("/tarea")
    @PreAuthorize("hasAnyRole('LIDER', 'ADMIN')")
    public ResponseEntity<Tarea> guardarTarea(@RequestBody @Valid Tarea tarea) {
        Tarea nuevaTarea = tareaService.guardarTarea(tarea);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaTarea);
    }

    @PostMapping("/tarea/rapida")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Tarea> guardarTareaRapida(@RequestBody @Valid Tarea tarea) {
        tarea.setProyectoId(null);
        Tarea nuevaTarea = tareaService.guardarTarea(tarea);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaTarea);
    }

    @PutMapping("/tarea/{id}")
    @PreAuthorize("hasAnyRole('LIDER', 'ADMIN')")
    public ResponseEntity<Tarea> actualizarTarea(@PathVariable Long id, @RequestBody @Valid Tarea tarea) {
        Tarea tareaActualizada = tareaService.actualizarTarea(id, tarea);
        return ResponseEntity.ok(tareaActualizada);
    }

    @PatchMapping("/tarea/{id}/finalizar")
    @PreAuthorize("hasAnyRole('MIEMBRO', 'LIDER', 'ADMIN')")
    public ResponseEntity<Tarea> finalizarTarea(@PathVariable Long id) {
        Tarea tareaFinalizada = tareaService.finalizarTarea(id);
        return ResponseEntity.ok(tareaFinalizada);
    }

    @DeleteMapping("/tarea/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> eliminarTarea(@PathVariable Long id) {
        String correo = SecurityContextHolder.getContext().getAuthentication().getName();
        tareaService.eliminarTarea(id, correo); // Pasamos el correo
        return ResponseEntity.noContent().build();
    }
}
