package com.taskflow.taskflow.service;

import com.taskflow.taskflow.entity.Rol;
import com.taskflow.taskflow.entity.Usuario;
import com.taskflow.taskflow.exception.EmailAlreadyExistsExceptions;
import com.taskflow.taskflow.exception.UsuarioNotFoundException;
import com.taskflow.taskflow.repository.IUsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioServiceImp implements IUsuarioService{

    private final IUsuarioRepository usuarioRepository;

    public UsuarioServiceImp(IUsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
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
        if(usuario.getRol() == null || usuario.getRol().getId() == null){
            Rol rolPorDefecto = new Rol();
            rolPorDefecto.setId(1);
            usuario.setRol(rolPorDefecto);
        }
        return usuarioRepository.save(usuario);
    }

    @Override
    public Usuario actualizarUsuario(Long id, Usuario usuario) {
        Usuario usuarioActual = usuarioRepository.findById(id).orElse(null);
        if(usuarioActual != null){
            usuarioActual.setNombreUsuario(usuario.getNombreUsuario());
            usuarioActual.setContrasena(usuario.getContrasena());
            return usuarioRepository.save(usuarioActual);
        }else{
            throw new UsuarioNotFoundException("El usuario que intenta modificar no existe");
        }

    }

    @Override
    public void eliminarUsuario(Long id) {
        Usuario usuarioExistente = usuarioRepository.findById(id).orElse(null);
        if(usuarioExistente != null){
            usuarioRepository.deleteById(id);
        }else{
            throw new UsuarioNotFoundException("El usuario que intenta eliminar no existe");
        }
    }

    @Override
    public boolean existePorCorreo(String correo) {
        return usuarioRepository.existsByCorreo(correo);
    }
}
