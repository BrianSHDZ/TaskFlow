package com.taskflow.taskflow.service;

import com.taskflow.taskflow.entity.Rol;
import com.taskflow.taskflow.exception.RolNotFoundException;
import com.taskflow.taskflow.repository.IRolRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RolServiceImpTest {

    @Mock
    private IRolRepository rolRepository;

    @InjectMocks
    private RolServiceImp rolService;

    //prueba para lista de todos los roles
    @Test
    void listarLosRoles() {
        Rol rolAdmin = new Rol();  //se crea el objeto
        rolAdmin.setId(1);
        rolAdmin.setNombre("ADMIN");
        when(rolRepository.findAll()).thenReturn(List.of(rolAdmin));
        List<Rol> resultado = rolService.listarRoles();
        assertEquals("ADMIN", resultado.get(0).getNombre());
    }

    //prueba de guardar un rol nuevo
    @Test
    void guardarUnRol() {
        Rol rolNuevo = new Rol();
        rolNuevo.setId(1);
        rolNuevo.setNombre("ADMIN");

        when(rolRepository.findByNombre("ADMIN")).thenReturn(Optional.empty());  //rol no existe
        when(rolRepository.save(rolNuevo)).thenReturn(rolNuevo); //rol guardado
        Rol resultado = rolService.guardarRol(rolNuevo);
        assertEquals("ADMIN", resultado.getNombre());
    }

    //prueba de error al registrar un rol ya existente
    @Test
    void guardarRolExistente(){
        Rol rolExistente = new Rol();
        rolExistente.setId(1);
        rolExistente.setNombre("ADMIN");

        when(rolRepository.findByNombre("ADMIN")).thenReturn(Optional.of(rolExistente));
        RuntimeException exception = assertThrows(IllegalArgumentException.class, () -> rolService.guardarRol(rolExistente));
        assertEquals("El rol " + rolExistente.getNombre() + " ya existe en la base de datos", exception.getMessage());
    }

    //prueba de eliminar un rol
    @Test
    void eliminarRol() {
        Integer idRol = 1;

        when(rolRepository.existsById(idRol)).thenReturn(true);
        rolService.eliminarRol(idRol);
    }

    //prueba eliminar rol inexistente
    @Test
    void eliminarRolInexistente() {
        Integer idInexistente = 99;

        when(rolRepository.existsById(idInexistente)).thenReturn(false);
        RuntimeException exception = assertThrows(RolNotFoundException.class, () -> rolService.eliminarRol(idInexistente));
        assertEquals("El rol con ID " + idInexistente +" no existe", exception.getMessage());
    }
}