package com.taskflow.taskflow.service;

import com.taskflow.taskflow.entity.Rol;
import com.taskflow.taskflow.exception.RolNotFoundException;
import com.taskflow.taskflow.repository.IRolRepository;
import org.springframework.stereotype.Service;

import javax.management.relation.RoleNotFoundException;
import java.util.List;
import java.util.Optional;

@Service
public class RolServiceImp implements IRolService{

    private final IRolRepository rolRepository;

    public RolServiceImp(IRolRepository rolRepository) { this.rolRepository = rolRepository; }

    @Override
    public List<Rol> listarRoles() { return rolRepository.findAll(); }

    /*@Override
    public Optional<Rol> obtenerRolPorId(Integer id) { return rolRepository.findById(id); }*/

    @Override
    public Rol guardarRol(Rol rol) {
        if(rolRepository.findByNombre(rol.getNombre()).isPresent()){
          throw new IllegalArgumentException("El rol " + rol.getNombre() + " ya existe en la base de datos");
        } return rolRepository.save(rol);
    }

    @Override
    public void eliminarRol(Integer id) {
        if(!rolRepository.existsById(id)){
            throw new RolNotFoundException("El rol con ID " + id +" no existe");
        }rolRepository.deleteById(id); }
}
