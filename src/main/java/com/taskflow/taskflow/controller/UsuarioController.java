package com.taskflow.taskflow.controller;

import com.taskflow.taskflow.entity.Usuario;
import com.taskflow.taskflow.service.IUsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/taskflow")
public class UsuarioController {

    private final IUsuarioService usuarioService;

    public UsuarioController(IUsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping("/usuario")
    public List<Usuario> listaUsuarios(){
        return usuarioService.listaUsarios();
    }

    @PostMapping("/usuario")
    public ResponseEntity<?> nuevoUsuario(@RequestBody @Valid Usuario usuario){
        Usuario usuarioCreado = usuarioService.nuevoUsuario(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioCreado);
    }


    @PutMapping("/usuario/{id}")
    public Usuario actualizarUsuario(@PathVariable Long id, @RequestBody Usuario usuario){
        return usuarioService.actualizarUsuario(id, usuario);
    }

    @DeleteMapping("/usuario/{id}")
    public void eliminarUsuario(@PathVariable Long id){ usuarioService.eliminarUsuario(id); }

    @GetMapping("/buscar")
    public ResponseEntity<List<Usuario>> buscarUsuarios(@RequestParam String query) {
        return ResponseEntity.ok(usuarioService.buscarUsuariosPorFiltro(query));
    }
}
