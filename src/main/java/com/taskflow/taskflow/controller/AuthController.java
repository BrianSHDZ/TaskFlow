/*package com.taskflow.taskflow.controller;

import com.taskflow.taskflow.dto.LoginRequest;
import com.taskflow.taskflow.entity.Usuario;
import com.taskflow.taskflow.repository.IUsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final IUsuarioRepository usuarioRepository;

    public AuthController(IUsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByCorreo(request.getCorreo());

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            if (usuario.getContrasena().equals(request.getContrasena())) {
                return ResponseEntity.ok(usuario);
            }
        } return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales incorrectas");
    }
}*/
//version 2
package com.taskflow.taskflow.controller;

import com.taskflow.taskflow.dto.LoginRequest;
import com.taskflow.taskflow.entity.Usuario;
import com.taskflow.taskflow.repository.IUsuarioRepository;
import com.taskflow.taskflow.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final IUsuarioRepository usuarioRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private com.taskflow.taskflow.service.IUsuarioService usuarioService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public AuthController(IUsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByCorreo(request.getCorreo());

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            // Validamos la contraseña usando BCrypt (o comparación directa si aún no hasheas al registrar)
            // Lo ideal con Spring Security es usar passwordEncoder.matches(...)
            if (passwordEncoder.matches(request.getContrasena(), usuario.getContrasena())) {
                // ¡Generamos el token JWT usando su correo como identificador!
                String token = jwtUtil.generateToken(usuario.getCorreo());
                // Devolvemos el token en un JSON limpio
                return ResponseEntity.ok(Collections.singletonMap("token", token));
            }
        } return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales incorrectas");
    }
    @PostMapping("/registro")
    public ResponseEntity<?> registrarUsuario(@RequestBody Usuario nuevoUsuario) {
        try {
            usuarioService.nuevoUsuario(nuevoUsuario);

            return ResponseEntity.ok("Usuario registrado exitosamente");
        } catch (Exception e) {
            // Si el correo ya existe, caerá aquí
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}


