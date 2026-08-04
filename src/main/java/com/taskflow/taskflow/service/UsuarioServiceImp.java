package com.taskflow.taskflow.service;

import com.taskflow.taskflow.entity.Usuario;
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

    /*@Override
    public Optional<Usuario> obtenerPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    @Override
    public Optional<Usuario> obtenerPorCorreo(String correo) {
        return usuarioRepository.findByCorreo(correo);
    }*/

    @Override
    public Usuario nuevoUsuario(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    @Override
    public Usuario actualizarUsuario(Long id, Usuario usuario) {
        Usuario usuarioActual = usuarioRepository.findById(id).orElse(null);
        if(usuarioActual != null){
            usuarioActual.setNombreUsuario(usuario.getNombreUsuario());
            usuarioActual.setContrasena(usuario.getContrasena());

        }return usuarioRepository.save(usuarioActual);
           // throw new (crear una excepsion) con else
    }

    @Override
    public Usuario eliminarUsuario(Long id) {
        Usuario usuarioExistente = usuarioRepository.findById(id).orElse(null);
        if(usuarioExistente != null){
            usuarioRepository.deleteById(id);
        }return null;
            //crear una excepsion con else
    }

    /*@Override
    public Boolean existePorCorreo(String correo) {
        return usuarioRepository.existsByCorreo(correo);
    }*/
}
