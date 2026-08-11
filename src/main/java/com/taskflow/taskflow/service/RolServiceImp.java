package com.taskflow.taskflow.service;

import com.taskflow.taskflow.entity.Rol;
import com.taskflow.taskflow.exception.RolAlreadyExistsExceptions;
import com.taskflow.taskflow.exception.RolEnUsoException;
import com.taskflow.taskflow.exception.RolNotFoundException;
import com.taskflow.taskflow.repository.IRolRepository;
import com.taskflow.taskflow.repository.IUsuarioRepository;
import org.springframework.stereotype.Service;

import javax.management.relation.RoleNotFoundException;
import java.util.List;
import java.util.Optional;

@Service
public class RolServiceImp implements IRolService{

    private final IRolRepository rolRepository;
    private final IUsuarioRepository usuarioRepository;

    public RolServiceImp(IRolRepository rolRepository, IUsuarioRepository usuarioRepository) { this.rolRepository = rolRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public List<Rol> listarRoles() { return rolRepository.findAll(); }

    /*@Override
    public Optional<Rol> obtenerRolPorId(Integer id) { return rolRepository.findById(id); }*/

    @Override
    public Rol guardarRol(Rol rol) {
        if(rolRepository.findByNombre(rol.getNombre()).isPresent()){
          throw new RolAlreadyExistsExceptions("El rol " + rol.getNombre() + " ya existe en la base de datos");
        } return rolRepository.save(rol);
    }

    @Override
    public void eliminarRol(Integer id) {
        if(!rolRepository.existsById(id)){
            throw new RolNotFoundException("El rol con ID " + id +" no existe");
        }
        if(usuarioRepository.existsByRolId(id)){
            throw new RolEnUsoException("No se puede eliminar el rol con ID " + id + " porque esta asignado a uno o mas usuarios");
        }rolRepository.deleteById(id); }
}
