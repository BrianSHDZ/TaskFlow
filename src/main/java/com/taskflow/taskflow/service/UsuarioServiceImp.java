package com.taskflow.taskflow.service;

import com.taskflow.taskflow.entity.Rol;
import com.taskflow.taskflow.entity.Usuario;
import com.taskflow.taskflow.exception.EmailAlreadyExistsExceptions;
import com.taskflow.taskflow.exception.RolNotFoundException;
import com.taskflow.taskflow.exception.UsuarioNotFoundException;
import com.taskflow.taskflow.exception.UsuarioWithProyectException;
import com.taskflow.taskflow.repository.IProyectoRepository;
import com.taskflow.taskflow.repository.IRolRepository;
import com.taskflow.taskflow.repository.IUsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioServiceImp implements IUsuarioService{

    private final IUsuarioRepository usuarioRepository;
    private final IProyectoRepository proyectoRepository;
    private final IRolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioServiceImp(IUsuarioRepository usuarioRepository, IProyectoRepository proyectoRepository, IRolRepository rolRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.proyectoRepository = proyectoRepository;
        this.rolRepository = rolRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<Usuario> listaUsarios() {
        return usuarioRepository.findAll();
    }

    @Override
    public Usuario nuevoUsuario(Usuario usuario) {
        if(usuarioRepository.existsByCorreo(usuario.getCorreo())){
            throw new EmailAlreadyExistsExceptions("El correo electronico ya existe");
        }
        if (usuario.getRol() == null || usuario.getRol().getId() == null) {
            Rol rolPorDefecto = rolRepository.findById(2)
                    .orElseThrow(() -> new RolNotFoundException("El rol por defecto con ID 2 no existe"));
            usuario.setRol(rolPorDefecto);
        }
        else {
            Integer rolId = usuario.getRol().getId();
            Rol rolExistente = rolRepository.findById(rolId).orElseThrow(() -> new RolNotFoundException("El rol con id " + rolId + " no existe"));
            usuario.setRol(rolExistente);
        }
        String contrasenaEncriptada = passwordEncoder.encode(usuario.getContrasena());
        usuario.setContrasena(contrasenaEncriptada);
        return usuarioRepository.save(usuario);
    }

    @Override
    public Usuario actualizarUsuario(Long id, Usuario usuario) {
        Usuario usuarioActual = usuarioRepository.findById(id).orElseThrow(() -> new UsuarioNotFoundException("El usuario con id " + id + " no existe"));
        if (usuario.getNombreUsuario() != null && !usuario.getNombreUsuario().isBlank()) {
            usuarioActual.setNombreUsuario(usuario.getNombreUsuario());
        }
        if (usuario.getCorreo() != null && !usuario.getCorreo().isBlank()) {
            if (!usuarioActual.getCorreo().equals(usuario.getCorreo()) && usuarioRepository.existsByCorreo(usuario.getCorreo())) {
                throw new EmailAlreadyExistsExceptions("El correo ya está registrado por otro usuario");
            }usuarioActual.setCorreo(usuario.getCorreo());
        }
        if (usuario.getContrasena() != null && !usuario.getContrasena().isBlank()) {
            String contrasenaEncriptada = passwordEncoder.encode(usuario.getContrasena());
            usuarioActual.setContrasena(contrasenaEncriptada);
        }
        if (usuario.getRol() != null && usuario.getRol().getId() != null) {
            Integer rolId = usuario.getRol().getId();
            Rol rolExistente = rolRepository.findById(rolId).orElseThrow(() -> new RolNotFoundException("El rol con id " + rolId + " no existe"));
            usuarioActual.setRol(rolExistente);
        } return usuarioRepository.save(usuarioActual);
    }

    @Override
    public void eliminarUsuario(Long id) {
        Usuario usuarioExistente = usuarioRepository.findById(id).orElse(null);
        if(usuarioExistente == null){
            throw new UsuarioNotFoundException("El usuario que intenta eliminar no existe");
        }
        if(proyectoRepository.existsByCreadoPor(id)){
            throw new UsuarioWithProyectException("No se puede eliminar el usuario porque es propietario de uno o mas proyectos activos");
        }usuarioRepository.delete(usuarioExistente);
    }

    @Override
    public boolean existePorCorreo(String correo) {
        return usuarioRepository.existsByCorreo(correo);
    }

    @Override
    public List<Usuario> buscarUsuariosPorFiltro(String filtro) {
        return usuarioRepository.buscarPorNombreOCorreo(filtro);
    }
}

