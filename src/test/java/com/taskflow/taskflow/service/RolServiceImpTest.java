package com.taskflow.taskflow.service;

import com.taskflow.taskflow.entity.Rol;
import com.taskflow.taskflow.exception.RolAlreadyExistsExceptions;
import com.taskflow.taskflow.exception.RolEnUsoException;
import com.taskflow.taskflow.exception.RolNotFoundException;
import com.taskflow.taskflow.repository.IRolRepository;
import com.taskflow.taskflow.repository.IUsuarioRepository;
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
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RolServiceImpTest {

    @Mock
    private IRolRepository rolRepository;

    @Mock
    private IUsuarioRepository usuarioRepository;

    @InjectMocks
    private RolServiceImp rolService;

    // Prueba para lista de todos los roles
    @Test
    void listarLosRoles() {
        Rol rolAdmin = new Rol();
        rolAdmin.setId(1);
        rolAdmin.setNombre("ADMIN");
        when(rolRepository.findAll()).thenReturn(List.of(rolAdmin));
        List<Rol> resultado = rolService.listarRoles();
        assertEquals("ADMIN", resultado.get(0).getNombre());
    }

    // Prueba de guardar un rol nuevo
    @Test
    void guardarUnRol() {
        Rol rolNuevo = new Rol();
        rolNuevo.setId(1);
        rolNuevo.setNombre("ADMIN");

        when(rolRepository.findByNombre("ADMIN")).thenReturn(Optional.empty());
        when(rolRepository.save(rolNuevo)).thenReturn(rolNuevo);
        Rol resultado = rolService.guardarRol(rolNuevo);
        assertEquals("ADMIN", resultado.getNombre());
    }

    // Prueba de error al registrar un rol ya existente
    @Test
    void guardarRolExistente() {
        Rol rolExistente = new Rol();
        rolExistente.setId(1);
        rolExistente.setNombre("ADMIN");

        when(rolRepository.findByNombre("ADMIN")).thenReturn(Optional.of(rolExistente));
        RolAlreadyExistsExceptions exception = assertThrows(RolAlreadyExistsExceptions.class, () -> rolService.guardarRol(rolExistente));
        assertEquals("El rol " + rolExistente.getNombre() + " ya existe en la base de datos", exception.getMessage());
    }

    // Prueba de eliminar un rol exitosamente
    @Test
    void eliminarRol() {
        Integer idRol = 1;
        when(rolRepository.existsById(idRol)).thenReturn(true);
        when(usuarioRepository.existsByRolId(idRol)).thenReturn(false);
        rolService.eliminarRol(idRol);
        verify(rolRepository, times(1)).deleteById(idRol);
    }

    // Prueba de error al intentar eliminar un rol que está en uso por un usuario
    @Test
    void eliminarRolEnUso() {
        Integer idRol = 1;
        when(rolRepository.existsById(idRol)).thenReturn(true);
        when(usuarioRepository.existsByRolId(idRol)).thenReturn(true); // El rol está en uso
        RolEnUsoException exception = assertThrows(RolEnUsoException.class, () -> rolService.eliminarRol(idRol));
        assertEquals("No se puede eliminar el rol con ID " + idRol + " porque esta asignado a uno o mas usuarios", exception.getMessage());
        verify(rolRepository, never()).deleteById(idRol);
    }

    // Prueba eliminar rol inexistente
    @Test
    void eliminarRolInexistente() {
        Integer idInexistente = 99;
        when(rolRepository.existsById(idInexistente)).thenReturn(false);
        RolNotFoundException exception = assertThrows(RolNotFoundException.class, () -> rolService.eliminarRol(idInexistente));
        assertEquals("El rol con ID " + idInexistente + " no existe", exception.getMessage());
    }
}