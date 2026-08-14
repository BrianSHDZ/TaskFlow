package com.taskflow.taskflow.controller;

import com.taskflow.taskflow.dto.ProyectoDTO;
import com.taskflow.taskflow.entity.Proyecto;
import com.taskflow.taskflow.service.IProyectoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/taskflow/proyecto") // Prefijo base para todos los endpoints de proyectos
public class ProyectoController {

    private final IProyectoService proyectoService;

    public ProyectoController(IProyectoService proyectoService) {
        this.proyectoService = proyectoService;
    }

    @GetMapping
    public List<Proyecto> listaProyecto() {
        return proyectoService.listarProyectos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerProyectoPorId(@PathVariable Long id) {
        return ResponseEntity.ok(proyectoService.obtenerProyectoPorId(id));
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<ProyectoDTO>> obtenerProyectoPorUsuario(@PathVariable Long usuarioId) {
        List<ProyectoDTO> proyectos = proyectoService.obtenerProyectosConConteoPorUsuario(usuarioId);
        return ResponseEntity.ok(proyectos);
    }

    @PostMapping
    public ResponseEntity<?> guardarProyecto(@RequestBody @Valid Proyecto proyecto) {
        Proyecto nuevoProyecto = proyectoService.guardarProyecto(proyecto);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoProyecto);
    }

    @PutMapping("/{id}")
    public Proyecto actualizarProyecto(@PathVariable Long id, @RequestBody @Valid Proyecto proyecto) {
        return proyectoService.actualizarProyecto(id, proyecto);
    }

    @DeleteMapping("/{id}")
    public void eliminarProyecto(@PathVariable Long id) {
        proyectoService.eliminarProyecto(id);
    }
}
