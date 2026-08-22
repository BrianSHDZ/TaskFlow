package com.taskflow.taskflow.service;

import com.taskflow.taskflow.entity.Rol;
import com.taskflow.taskflow.entity.Usuario;
import com.taskflow.taskflow.exception.EmailAlreadyExistsExceptions;
import com.taskflow.taskflow.exception.RolNotFoundException;
import com.taskflow.taskflow.exception.UsuarioNotFoundException;
import com.taskflow.taskflow.exception.UsuarioWithProyectException;
import com.taskflow.taskflow.repository.IProyectoRepository;
import com.taskflow.taskflow.repository.IRolRepository;
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
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceImpTest {

    @Mock
    private IUsuarioRepository usuarioRepository;

    @Mock
    private IProyectoRepository proyectoRepository;

    @Mock
    private IRolRepository rolRepository;

    @InjectMocks
    private UsuarioServiceImp usuarioService;

    private Usuario usuarioBase;
    private Rol rolBase;

    @BeforeEach
    void setUp() {
        rolBase = new Rol();
        rolBase.setId(1);
        rolBase.setNombre("USER");

        usuarioBase = new Usuario();
        usuarioBase.setId(1L);
        usuarioBase.setNombreUsuario("Mario");
        usuarioBase.setCorreo("mario26@gmail.com");
        usuarioBase.setContrasena("123456789101112");
        usuarioBase.setRol(rolBase);
    }

    // Prueba para la lista
    @Test
    void listaDeUsuarios() {
        List<Usuario> listaDeUsuarios = List.of(usuarioBase);
        when(usuarioRepository.findAll()).thenReturn(listaDeUsuarios);
        List<Usuario> resultado = usuarioService.listaUsarios();
        assertEquals("Mario", resultado.get(0).getNombreUsuario());
    }

    // Prueba de registro de un nuevo usuario con éxito
    @Test
    void unNuevoUsuario() {
        when(usuarioRepository.existsByCorreo(usuarioBase.getCorreo())).thenReturn(false);
        when(rolRepository.findById(anyInt())).thenReturn(Optional.of(rolBase));
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuarioBase);

        Usuario resultado = usuarioService.nuevoUsuario(usuarioBase);

        assertNotNull(resultado);
        assertEquals("Mario", resultado.getNombreUsuario());
    }

    // Prueba de error al registrar con correo existente
    @Test
    void unNuevoUsuarioError() {
        when(usuarioRepository.existsByCorreo(usuarioBase.getCorreo())).thenReturn(true);
        assertThrows(EmailAlreadyExistsExceptions.class, () -> usuarioService.nuevoUsuario(usuarioBase));
    }

    // Prueba de nuevo usuario con rol nulo
    @Test
    void unNuevoUsuarioConRolNull() {
        usuarioBase.setRol(null);

        when(usuarioRepository.existsByCorreo(usuarioBase.getCorreo())).thenReturn(false);
        when(rolRepository.findById(anyInt())).thenReturn(Optional.of(rolBase));
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuarioBase);

        Usuario resultado = usuarioService.nuevoUsuario(usuarioBase);

        assertNotNull(resultado.getRol());
        assertEquals(1, resultado.getRol().getId());
    }

    // Prueba de actualización de un usuario existente
    @Test
    void actualizarUnUsuario() {
        Usuario datosNuevos = new Usuario();
        datosNuevos.setNombreUsuario("Luis");
        datosNuevos.setContrasena("nueva123");
        datosNuevos.setCorreo("mario26@gmail.com");

        Rol nuevoRol = new Rol();
        nuevoRol.setId(1);
        datosNuevos.setRol(nuevoRol);

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuarioBase));
        when(rolRepository.findById(1)).thenReturn(Optional.of(nuevoRol));
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuarioBase);

        Usuario resultado = usuarioService.actualizarUsuario(1L, datosNuevos);

        assertNotNull(resultado);
        assertEquals("Luis", resultado.getNombreUsuario());
    }

    // Prueba de error al actualizar usuario inexistente
    @Test
    void actualizarUnUsuarioError() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.empty());
        RuntimeException exception = assertThrows(UsuarioNotFoundException.class, () -> usuarioService.actualizarUsuario(1L, usuarioBase));
        // Ajustado para coincidir exactamente con el mensaje que arroja el servicio ("El usuario con id 1 no existe")
        assertEquals("El usuario con id 1 no existe", exception.getMessage());
    }

    // Prueba de error al actualizar con un correo ya registrado por otro usuario
    @Test
    void actualizarUsuarioCorreoDuplicadoError() {
        Usuario datosNuevos = new Usuario();
        datosNuevos.setCorreo("otro@gmail.com");

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuarioBase));
        when(usuarioRepository.existsByCorreo("otro@gmail.com")).thenReturn(true);

        assertThrows(EmailAlreadyExistsExceptions.class, () -> usuarioService.actualizarUsuario(1L, datosNuevos));
    }

    // Prueba de eliminar a un usuario exitosamente
    @Test
    void eliminarUnUsuario() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuarioBase));
        when(proyectoRepository.existsByCreadoPor(1L)).thenReturn(false);
        doNothing().when(usuarioRepository).delete(usuarioBase);

        usuarioService.eliminarUsuario(1L);

        verify(usuarioRepository, times(1)).delete(usuarioBase);
    }

    // Prueba de error al eliminar usuario con proyectos asociados
    @Test
    void eliminarUsuarioConProyectosError() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuarioBase));
        when(proyectoRepository.existsByCreadoPor(1L)).thenReturn(true);

        UsuarioWithProyectException exception = assertThrows(UsuarioWithProyectException.class, () -> usuarioService.eliminarUsuario(1L));
        assertEquals("No se puede eliminar el usuario porque es propietario de uno o mas proyectos activos", exception.getMessage());

        verify(usuarioRepository, never()).delete(any());
    }

    // Prueba de eliminar a un usuario inexistente
    @Test
    void eliminarUsuarioError() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.empty());
        RuntimeException exception = assertThrows(UsuarioNotFoundException.class, () -> usuarioService.eliminarUsuario(1L));
        assertEquals("El usuario que intenta eliminar no existe", exception.getMessage());
    }

    // Prueba de que el correo sí existe
    @Test
    void existeElCorreo() {
        when(usuarioRepository.existsByCorreo(usuarioBase.getCorreo())).thenReturn(true);

        boolean resultado = usuarioService.existePorCorreo(usuarioBase.getCorreo());

        assertTrue(resultado);
    }

    // Prueba para buscar usuarios por filtro (nombre o correo)
    @Test
    void buscarUsuariosPorFiltro() {
        List<Usuario> listaDeUsuarios = List.of(usuarioBase);
        when(usuarioRepository.buscarPorNombreOCorreo("Mario")).thenReturn(listaDeUsuarios);

        List<Usuario> resultado = usuarioService.buscarUsuariosPorFiltro("Mario");

        assertNotNull(resultado);
        assertFalse(resultado.isEmpty());
        assertEquals(1, resultado.size());
        assertEquals("Mario", resultado.get(0).getNombreUsuario());
        verify(usuarioRepository, times(1)).buscarPorNombreOCorreo("Mario");
    }
}