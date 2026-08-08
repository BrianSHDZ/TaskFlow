package com.taskflow.taskflow.controller;

import com.taskflow.taskflow.entity.Proyecto;
import com.taskflow.taskflow.service.IProyectoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/taskflow")
public class ProyectoController {

    private final IProyectoService proyectoService;

    public ProyectoController(IProyectoService proyectoService) { this.proyectoService = proyectoService; }

    @GetMapping("/proyecto")
    public List<Proyecto> listaProyecto(){ return proyectoService.listarProyectos(); }

    @GetMapping("/proyecto/{id}")
    public ResponseEntity<?> obtenerProyectoPorId(@PathVariable Long id){
        return ResponseEntity.ok(proyectoService.obtenerProyectoPorId(id));
    }

    @GetMapping("/proyecto/usuario/{usuarioId}")
    public ResponseEntity<?> obtenerProyectoPorUsuario(@PathVariable Long usuarioId){
        return ResponseEntity.ok(proyectoService.obtenerProyectoPorUsuario(usuarioId));
    }

    @PostMapping("/proyecto")
    public ResponseEntity<?> guardarProyecto(@RequestBody @Valid Proyecto proyecto){
        Proyecto nuevoProyecto = proyectoService.guardarProyecto(proyecto);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoProyecto);
    }

    @PutMapping("/proyecto/{id}")
    public Proyecto actualizarProyecto(@PathVariable Long id,@RequestBody @Valid Proyecto proyecto){
        return proyectoService.actualizarProyecto(id, proyecto);
    }

    @DeleteMapping("/proyecto/{id}")
    public void eliminarProyecto(@PathVariable Long id){ proyectoService.eliminarProyecto(id); }
}
