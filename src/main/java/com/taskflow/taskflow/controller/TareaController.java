package com.taskflow.taskflow.controller;

import com.taskflow.taskflow.entity.Tarea;
import com.taskflow.taskflow.exception.TareaNotFoundException;
import com.taskflow.taskflow.service.ITareaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/taskflow")
public class TareaController {

    private final ITareaService tareaService;

    public TareaController(ITareaService tareaService) { this.tareaService = tareaService; }

    @GetMapping("/tarea")
    public List<Tarea> listaTareas(){ return tareaService.listarTareas(); }

    @GetMapping("/tarea/{id}")
    public ResponseEntity<Tarea> obtenerTareaPorId(@PathVariable Long id) {
        Tarea tarea = tareaService.buscarTareasPorId(id)
                .orElseThrow(() -> new TareaNotFoundException("No se encontro la tarea con id: " + id));
        return ResponseEntity.ok(tarea);
    }

    @GetMapping("/tarea/estatus/{estatus}")
    public ResponseEntity<List<Tarea>> obtenerTareasPorEstatus(@PathVariable String estatus) {
        return ResponseEntity.ok(tareaService.obtenerTareasPorEstatus(estatus));
    }

    // Buscar por asignado y estatus (ej: /taskflow/tarea/usuario/1/estatus/EN_CURSO)
    @GetMapping("/tarea/usuario/{usuarioId}/estatus/{estatus}")
    public ResponseEntity<List<Tarea>> obtenerTareasPorAsignadoYEstatus(@PathVariable Long usuarioId, @PathVariable String estatus) {
        return ResponseEntity.ok(tareaService.obtenerTareasPorAsignadoYEstatus(usuarioId, estatus));
    }

    @GetMapping("/tarea/proyecto/{proyectoId}")
    public ResponseEntity<?> obtenerTareasPorProyecto(@PathVariable Long proyectoId){
        return ResponseEntity.ok(tareaService.obtenerTareaPorProyectoId(proyectoId));
    }

    @GetMapping("/tarea/usuario/{asignadoA}")
    public ResponseEntity<?>  obtenerTareaPorAsignadoA(@PathVariable Long asignadoA){
        return ResponseEntity.ok(tareaService.obtenerTareaPorAsignadoA(asignadoA));
    }

    @PostMapping("/tarea")
    public ResponseEntity<?> guardarTarea(@RequestBody @Valid Tarea tarea){
        Tarea nuevaTarea = tareaService.guardarTarea(tarea);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaTarea);
    }

    @PutMapping("/tarea/{id}")
    public Tarea actualizarTarea(@PathVariable Long id, @RequestBody @Valid Tarea tarea){
        return tareaService.actualizarTarea(id, tarea);
    }

    @PatchMapping("/tarea/{id}/finalizar")
    public ResponseEntity<Tarea> finalizarTarea(@PathVariable Long id) {
        Tarea tareaFinalizada = tareaService.finalizarTarea(id);
        return ResponseEntity.ok(tareaFinalizada);
    }

    @DeleteMapping("/tarea/{id}")
    public void eliminarTarea(@PathVariable Long id){ tareaService.eliminarTarea(id); }
}
