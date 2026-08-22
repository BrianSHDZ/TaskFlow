package com.taskflow.taskflow.controller;

import com.taskflow.taskflow.dto.ProyectoDTO;
import com.taskflow.taskflow.entity.Proyecto;
import com.taskflow.taskflow.service.IProyectoService;
import com.taskflow.taskflow.service.IUsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/taskflow/proyecto") // Prefijo base para todos los endpoints de proyectos
public class ProyectoController {

    private final IProyectoService proyectoService;
    private final IUsuarioService usuarioService;

    public ProyectoController(IProyectoService proyectoService, IUsuarioService usuarioService) {
        this.proyectoService = proyectoService;
        this.usuarioService = usuarioService;
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
    @PreAuthorize("hasAnyRole('MIEMBRO', 'LIDER', 'ADMIN')")
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
    @PreAuthorize("hasAnyRole('MIEMBRO', 'LIDER', 'ADMIN')")
    public ResponseEntity<?> guardarProyecto(@RequestBody @Valid Proyecto proyecto) {
        String correoUsuarioAutenticado = SecurityContextHolder.getContext().getAuthentication().getName();
        Proyecto nuevoProyecto = proyectoService.guardarProyecto(proyecto);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoProyecto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public Proyecto actualizarProyecto(@PathVariable Long id, @RequestBody @Valid Proyecto proyecto) {

        String correoUsuarioAutenticado = SecurityContextHolder.getContext().getAuthentication().getName();

        // Le pasamos el correo al servicio, él se encargará de validar
        return proyectoService.actualizarProyecto(id, proyecto, correoUsuarioAutenticado);
    }

    @PutMapping("/{id}/estatus")
    @PreAuthorize("isAuthenticated()") // Solo pedimos que esté logueado
    public ResponseEntity<?> actualizarEstatusProyecto(@PathVariable Long id, @RequestParam String estatus) {

        String correoUsuarioAutenticado = SecurityContextHolder.getContext().getAuthentication().getName();

        try {
            Proyecto proyecto = proyectoService.obtenerProyectoPorId(id);
            proyecto.setEstatus(estatus);

            // Aquí reutilizamos tu método actualizarProyecto que ahora pedirá el correo
            Proyecto proyectoActualizado = proyectoService.actualizarProyecto(id, proyecto, correoUsuarioAutenticado);

            return ResponseEntity.ok(proyectoActualizado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al actualizar el estatus: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public void eliminarProyecto(@PathVariable Long id) {
        String correoUsuarioAutenticado = SecurityContextHolder.getContext().getAuthentication().getName();
        proyectoService.eliminarProyecto(id, correoUsuarioAutenticado);
    }
}
