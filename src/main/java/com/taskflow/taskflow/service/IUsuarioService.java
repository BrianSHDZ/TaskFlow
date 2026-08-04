package com.taskflow.taskflow.service;

import com.taskflow.taskflow.entity.Usuario;

import java.util.List;
import java.util.Optional;

public interface IUsuarioService {
    List<Usuario> listaUsarios();  //Obtener lista de usuarios
    /*Optional<Usuario> obtenerPorId(Long id);
    Optional<Usuario> obtenerPorCorreo(String correo);*/

    Usuario nuevoUsuario(Usuario usuario);  //Insertar nuevos usuarios

    Usuario actualizarUsuario(Long id, Usuario usuario);  //Actualizar datos completos del usuario

    Usuario eliminarUsuario(Long id);  //Eliminar usuario por id

    /*Boolean existePorCorreo(String correo);*/
}
