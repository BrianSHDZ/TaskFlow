package com.taskflow.taskflow.controller;

import com.taskflow.taskflow.entity.Rol;
import com.taskflow.taskflow.service.IRolService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/taskflow")
public class RolController {

    private final IRolService rolService;

    public RolController(IRolService rolService) { this.rolService = rolService; }

    @GetMapping("/rol")
    public List<Rol> obtenerRols(){ return rolService.listarRoles(); }

    @PostMapping("/rol")
    public ResponseEntity<?> guardarRol(@RequestBody Rol rol){
        Rol nuevoRol = rolService.guardarRol(rol);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoRol);
    }

    @DeleteMapping("/rol/{id}")
    public void eliminarRol(@PathVariable Integer id){
        rolService.eliminarRol(id);
    }
}
