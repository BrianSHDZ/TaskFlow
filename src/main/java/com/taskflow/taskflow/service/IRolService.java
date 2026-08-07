package com.taskflow.taskflow.service;

import com.taskflow.taskflow.entity.Rol;

import java.util.List;
import java.util.Optional;

public interface IRolService {
    List<Rol> listarRoles();  //obtenemos una lista de todos los roles que registramos

    //Optional<Rol> obtenerRolPorId(Integer id);  //busca un rol especifico con su ID

    Rol guardarRol(Rol rol);  //registramos un rol o guardamos las modificaciones de uno ya existente

    void eliminarRol(Integer id);  //elimina un rol con su ID
}
