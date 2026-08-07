package com.taskflow.taskflow.controller;

import com.taskflow.taskflow.entity.Tarea;
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

    @GetMapping("/tarea/proyecto/{proyectoId}")
    public ResponseEntity<?> obtenerTareasPorProyecto(@PathVariable Long proyectoId){
        return ResponseEntity.ok(tareaService.obtenerTareaPorProyectoId(proyectoId));
    }

    @GetMapping("/tarea/usuario/{asignadoA}")
    public ResponseEntity<?>  obtenerTareaPorAsignadoA(@PathVariable Long asignadoA){
        return ResponseEntity.ok(tareaService.obtenerTareaPorAsignadoA(asignadoA));
    }

    @PostMapping("/tarea")
    public ResponseEntity<?> guardarTarea(@RequestBody @Valid Tarea tarea){ //aqui no es necesario poner @Valid?
        Tarea nuevaTarea = tareaService.guardarTarea(tarea);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaTarea);
    }

    @PutMapping("/tarea/{id}")
    public Tarea actualizarTarea(@PathVariable Long id, @RequestBody @Valid Tarea tarea){
        return tareaService.actualizarTarea(id, tarea);
    }

    @DeleteMapping("/tarea/{id}")
    public void eliminarTarea(@PathVariable Long id){ tareaService.eliminarTarea(id); }
}
