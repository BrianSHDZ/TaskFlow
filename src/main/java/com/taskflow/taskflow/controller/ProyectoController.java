package com.taskflow.taskflow.controller;

import com.taskflow.taskflow.dto.ProyectoDTO;
import com.taskflow.taskflow.entity.Proyecto;
import com.taskflow.taskflow.service.IProyectoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
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
        String correoUsuarioAutenticado = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("¡Petición recibida! El usuario autenticado es: " + correoUsuarioAutenticado);
        return proyectoService.listarProyectos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerProyectoPorId(@PathVariable Long id) {
        String correoUsuarioAutenticado = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(proyectoService.obtenerProyectoPorId(id));
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<ProyectoDTO>> obtenerProyectoPorUsuario(@PathVariable Long usuarioId) {
        String correoUsuarioAutenticado = SecurityContextHolder.getContext().getAuthentication().getName();
        List<ProyectoDTO> proyectos = proyectoService.obtenerProyectosConConteoPorUsuario(usuarioId);
        return ResponseEntity.ok(proyectos);
    }

    @GetMapping("/usuario/{usuarioId}/completados")
    public ResponseEntity<List<Proyecto>> obtenerProyectosCompletados(@PathVariable Long usuarioId) {
        String correoUsuarioAutenticado = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(proyectoService.obtenerProyectosCompletados(usuarioId));
    }

    @PostMapping
    public ResponseEntity<?> guardarProyecto(@RequestBody @Valid Proyecto proyecto) {
        String correoUsuarioAutenticado = SecurityContextHolder.getContext().getAuthentication().getName();
        Proyecto nuevoProyecto = proyectoService.guardarProyecto(proyecto);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoProyecto);
    }

    @PutMapping("/{id}")
    public Proyecto actualizarProyecto(@PathVariable Long id, @RequestBody @Valid Proyecto proyecto) {
        String correoUsuarioAutenticado = SecurityContextHolder.getContext().getAuthentication().getName();
        return proyectoService.actualizarProyecto(id, proyecto);
    }

    @PutMapping("/{id}/estatus")
    public ResponseEntity<?> actualizarEstatusProyecto(@PathVariable Long id, @RequestParam String estatus) {
        String correoUsuarioAutenticado = SecurityContextHolder.getContext().getAuthentication().getName();
        try {
            // 1. Buscamos el proyecto actual por su ID
            // (Ajusta el nombre del método de tu servicio si es diferente)
            Proyecto proyecto = proyectoService.obtenerProyectoPorId(id);
            // 2. Le cambiamos únicamente el estatus
            proyecto.setEstatus(estatus);
            // 3. Reutilizamos tu método existente para guardarlo actualizado
            Proyecto proyectoActualizado = proyectoService.actualizarProyecto(id, proyecto);
            return ResponseEntity.ok(proyectoActualizado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al actualizar el estatus: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public void eliminarProyecto(@PathVariable Long id) {
        String correoUsuarioAutenticado = SecurityContextHolder.getContext().getAuthentication().getName();
        proyectoService.eliminarProyecto(id);
    }
}
