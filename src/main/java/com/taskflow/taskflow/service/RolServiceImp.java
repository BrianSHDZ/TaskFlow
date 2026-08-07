package com.taskflow.taskflow.service;

import com.taskflow.taskflow.entity.Rol;
import com.taskflow.taskflow.repository.IRolRepository;
import org.springframework.stereotype.Service;

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
    public Rol guardarRol(Rol rol) { return rolRepository.save(rol); }

    @Override
    public void eliminarRol(Integer id) { rolRepository.deleteById(id); }
}
