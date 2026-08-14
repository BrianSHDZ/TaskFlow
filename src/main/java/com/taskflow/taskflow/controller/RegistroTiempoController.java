package com.taskflow.taskflow.controller;

import com.taskflow.taskflow.entity.RegistroTiempo;
import com.taskflow.taskflow.service.IRegistroTiempoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/taskflow")
public class RegistroTiempoController {
    private final IRegistroTiempoService registroTiempoService;
    public RegistroTiempoController(IRegistroTiempoService registroTiempoService) {
        this.registroTiempoService = registroTiempoService;
    }
    // Iniciar cronómetro
    @PostMapping("/registrotiempo/iniciar")
    public ResponseEntity<?> iniciarTiempo(@RequestParam Long tareaId, @RequestParam Long usuarioId) {
        RegistroTiempo nuevoRegistro = registroTiempoService.iniciarTiempo(tareaId, usuarioId);
        return new ResponseEntity<>(nuevoRegistro, HttpStatus.CREATED);
    }

    // Detener cronómetro
    @PatchMapping("/registrotiempo/{id}/detener")
    public ResponseEntity<RegistroTiempo> detenerTiempo(@PathVariable Long id) {
        RegistroTiempo registroActualizado = registroTiempoService.detenerTiempo(id);
        return ResponseEntity.ok(registroActualizado);
    }

    // Listar por Tarea
    @GetMapping("/registrotiempo/tarea/{tareaId}")
    public ResponseEntity<List<RegistroTiempo>> obtenerPorTareaId(@PathVariable Long tareaId) {
        return ResponseEntity.ok(registroTiempoService.obtenerTiempoPorTareaId(tareaId));
    }

    // Listar por Usuario
    @GetMapping("/registrotiempo/usuario/{usuarioId}")
    public ResponseEntity<List<RegistroTiempo>> obtenerPorUsuarioId(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(registroTiempoService.obtenerTiempoPorUsuarioId(usuarioId));
    }
}
