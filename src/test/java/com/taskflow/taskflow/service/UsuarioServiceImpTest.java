package com.taskflow.taskflow.service;

import com.taskflow.taskflow.entity.Rol;
import com.taskflow.taskflow.entity.Usuario;
import com.taskflow.taskflow.exception.EmailAlreadyExistsExceptions;
import com.taskflow.taskflow.exception.UsuarioNotFoundException;
import com.taskflow.taskflow.repository.IUsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceImpTest {

    @Mock
    private IUsuarioRepository usuarioRepository;

    @InjectMocks
    private UsuarioServiceImp usuarioService;

    //Creamos un Usuario para reutilizarlo en todas las pruebas
    private Usuario usuarioBase;

    @BeforeEach
    void setUp() {
        usuarioBase = new Usuario();
        usuarioBase.setId(1L);
        usuarioBase.setNombreUsuario("Mario");
        usuarioBase.setCorreo("mario26@gmail.com");
        usuarioBase.setContrasena("123456789101112");

        Rol rol = new Rol();
        rol.setId(1);
        usuarioBase.setRol(rol);
    }
    //prueba para la lista
    @Test
    void listaDeUsuarios(){
        List<Usuario> listaDeUsuarios = List.of(usuarioBase); //creamos la lista de usuario
        when(usuarioRepository.findAll()).thenReturn(listaDeUsuarios);
        List<Usuario> resultado = usuarioService.listaUsarios();
        assertEquals("Mario", resultado.get(0).getNombreUsuario());
    }

    //prueba que el registro de un nuevo usuario funcione correctamente cuando el correo es valido(no duplicado) y se guarde
    @Test
    void unNuevoUsuario() {
        when(usuarioRepository.existsByCorreo(usuarioBase.getCorreo())).thenReturn(false); //aqui el correo decimos que no existe(no es duplicado)
        when(usuarioRepository.save(usuarioBase)).thenReturn(usuarioBase); //al guardar devuelve usuarioBase

        Usuario resultado = usuarioService.nuevoUsuario(usuarioBase);

        assertNotNull(resultado); //se comprueba el resultado no sea nulo
        assertEquals("Mario", resultado.getNombreUsuario());
    }

    //prueba cuando el registro de un usuario tiene error registrandose con correo existente
    @Test
    void unNuevoUsuarioError(){
        when(usuarioRepository.existsByCorreo(usuarioBase.getCorreo())).thenReturn(true);
        assertThrows(EmailAlreadyExistsExceptions.class, () -> usuarioService.nuevoUsuario(usuarioBase));
    }

    //prueba de nuevo usuario con rol nulo
    @Test
    void unNuevoUsuarioConRolNull() {
        usuarioBase.setRol(null);

        when(usuarioRepository.existsByCorreo(usuarioBase.getCorreo())).thenReturn(false);
        when(usuarioRepository.save(usuarioBase)).thenReturn(usuarioBase);

        Usuario resultado = usuarioService.nuevoUsuario(usuarioBase);

        assertNotNull(resultado.getRol());
        assertEquals(1, resultado.getRol().getId());
    }

    //prueba de actualizacion parcial de un usuario ya existente
    @Test
    void actualizarUnUsuario() {
        //datos nuevos con un Id=1
        Usuario datosNuevos = new Usuario();
        datosNuevos.setNombreUsuario("Luis");
        datosNuevos.setContrasena("nueva123");

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuarioBase)); //buscamos con el id en la base de datos
        when(usuarioRepository.save(usuarioBase)).thenReturn(usuarioBase); //al guardar los cambios devuelve al usuario actualizado parcialmente

        Usuario resultado = usuarioService.actualizarUsuario(1L, datosNuevos);

        assertNotNull(resultado); //verificamos no sea nulo
        assertEquals("Luis", resultado.getNombreUsuario());
    }

    //prueba de actualizar a un usuario inexistente
    @Test
    void actualizarUnUsuarioError(){
        when(usuarioRepository.findById(1L)).thenReturn(Optional.empty());
        RuntimeException exception = assertThrows(UsuarioNotFoundException.class, () -> usuarioService.actualizarUsuario(1L, usuarioBase));
        assertEquals("El usuario que intenta modificar no existe", exception.getMessage());
    }

    //prueba de eliminar a un usuario
    @Test
    void eliminarUnUsuario() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuarioBase));
        usuarioService.eliminarUsuario(1L);
    }

    //prueba de eliminar a un usuario inexistente
    @Test
    void eliminarUsuarioError(){
        when(usuarioRepository.findById(1L)).thenReturn(Optional.empty());
        RuntimeException exception = assertThrows(UsuarioNotFoundException.class, () -> usuarioService.eliminarUsuario(1L));
        assertEquals("El usuario que intenta eliminar no existe", exception.getMessage());
    }

    //prueba de que el correo si existe
    @Test
    void existeElCorreo() {
        when(usuarioRepository.existsByCorreo(usuarioBase.getCorreo())).thenReturn(true);

        boolean resultado = usuarioService.existePorCorreo(usuarioBase.getCorreo());

        assertTrue(resultado);

    }
}