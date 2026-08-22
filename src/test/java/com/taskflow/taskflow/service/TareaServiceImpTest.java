package com.taskflow.taskflow.service;

import com.taskflow.taskflow.entity.Proyecto;
import com.taskflow.taskflow.entity.RegistroTiempo;
import com.taskflow.taskflow.entity.Tarea;
import com.taskflow.taskflow.entity.Usuario;
import com.taskflow.taskflow.exception.DatosInvalidosException;
import com.taskflow.taskflow.exception.ProyectoNotFoundException;
import com.taskflow.taskflow.exception.TareaNotFoundException;
import com.taskflow.taskflow.exception.UsuarioNotFoundException;
import com.taskflow.taskflow.repository.IProyectoRepository;
import com.taskflow.taskflow.repository.IRegistroTiempoRepository;
import com.taskflow.taskflow.repository.ITareaRepository;
import com.taskflow.taskflow.repository.IUsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TareaServiceImpTest {

    @Mock
    private ITareaRepository tareaRepository;

    @Mock
    private IUsuarioRepository usuarioRepository;

    @Mock
    private IProyectoRepository proyectoRepository;

    @Mock
    private IRegistroTiempoRepository registroTiempoRepository;

    @InjectMocks
    private TareaServiceImp tareaService;

    private Tarea tareaBase;
    private Usuario usuarioBase;
    private Proyecto proyectoBase;

    @BeforeEach
    void setUp() {
        usuarioBase = new Usuario();
        usuarioBase.setId(1L);
        usuarioBase.setNombreUsuario("Mario");
        usuarioBase.setCorreo("mario26@gmail.com");

        proyectoBase = new Proyecto();
        proyectoBase.setId(10L);
        proyectoBase.setCreadoPor(1L);

        tareaBase = new Tarea();
        tareaBase.setId(1L);
        tareaBase.setTitulo("Desarrollar módulo");
        tareaBase.setDescripcion("Crear endpoints");
        tareaBase.setEstatus("PENDIENTE");
        tareaBase.setPrioridad("ALTA");
        tareaBase.setAsignadoA(1L);
    }

    @Test
    void listarTareas() {
        when(tareaRepository.findAll()).thenReturn(List.of(tareaBase));
        List<Tarea> resultado = tareaService.listarTareas();
        assertFalse(resultado.isEmpty());
        assertEquals(1, resultado.size());
    }

    @Test
    void buscarTareasPorId() {
        when(tareaRepository.findById(1L)).thenReturn(Optional.of(tareaBase));
        Optional<Tarea> resultado = tareaService.buscarTareasPorId(1L);
        assertTrue(resultado.isPresent());
        assertEquals("Desarrollar módulo", resultado.get().getTitulo());
    }

    @Test
    void obtenerTareaPorProyectoId() {
        when(tareaRepository.findByProyectoId(10L)).thenReturn(List.of(tareaBase));
        List<Tarea> resultado = tareaService.obtenerTareaPorProyectoId(10L);
        assertFalse(resultado.isEmpty());
    }

    @Test
    void obtenerTareaPorAsignadoA() {
        when(tareaRepository.findByAsignadoA(1L)).thenReturn(List.of(tareaBase));
        List<Tarea> resultado = tareaService.obtenerTareaPorAsignadoA(1L);
        assertFalse(resultado.isEmpty());
    }

    @Test
    void guardarTareaExitosamente() {
        when(usuarioRepository.existsById(1L)).thenReturn(true);
        when(tareaRepository.save(any(Tarea.class))).thenReturn(tareaBase);

        Tarea resultado = tareaService.guardarTarea(tareaBase);
        assertNotNull(resultado);
        assertEquals("PENDIENTE", resultado.getEstatus());
    }

    @Test
    void guardarTareaTituloNuloError() {
        tareaBase.setTitulo(null);
        assertThrows(DatosInvalidosException.class, () -> tareaService.guardarTarea(tareaBase));
    }

    @Test
    void guardarTareaEstatusInvalidoError() {
        tareaBase.setEstatus("ESTATUS_FALSO");
        // Quitamos el when(...) de usuarioRepository ya que la validación del estatus ocurre antes
        assertThrows(IllegalArgumentException.class, () -> tareaService.guardarTarea(tareaBase));
    }

    @Test
    void guardarTareaPrioridadInvalidaError() {
        tareaBase.setPrioridad("SUPER_ALTA");
        assertThrows(IllegalArgumentException.class, () -> tareaService.guardarTarea(tareaBase));
    }

    @Test
    void guardarTareaProyectoInexistenteError() {
        tareaBase.setProyectoId(99L);
        when(proyectoRepository.existsById(99L)).thenReturn(false);
        assertThrows(ProyectoNotFoundException.class, () -> tareaService.guardarTarea(tareaBase));
    }

    @Test
    void guardarTareaConInputCorreoUsuario() {
        tareaBase.setAsignadoA(null);
        tareaBase.setAsignadoAInput("mario26@gmail.com");
        when(usuarioRepository.findByCorreo("mario26@gmail.com")).thenReturn(Optional.of(usuarioBase));
        when(tareaRepository.save(any(Tarea.class))).thenReturn(tareaBase);

        Tarea resultado = tareaService.guardarTarea(tareaBase);
        assertNotNull(resultado);
    }

    @Test
    void guardarTareaConInputNombreUsuario() {
        tareaBase.setAsignadoA(null);
        tareaBase.setAsignadoAInput("Mario");
        when(usuarioRepository.findByCorreo("Mario")).thenReturn(Optional.empty());
        when(usuarioRepository.findByNombreUsuarioIgnoreCase("Mario")).thenReturn(Optional.of(usuarioBase));
        when(tareaRepository.save(any(Tarea.class))).thenReturn(tareaBase);

        Tarea resultado = tareaService.guardarTarea(tareaBase);
        assertNotNull(resultado);
    }

    @Test
    void guardarTareaInputUsuarioNoExisteError() {
        tareaBase.setAsignadoA(null);
        tareaBase.setAsignadoAInput("Inexistente");
        when(usuarioRepository.findByCorreo("Inexistente")).thenReturn(Optional.empty());
        when(usuarioRepository.findByNombreUsuarioIgnoreCase("Inexistente")).thenReturn(Optional.empty());

        assertThrows(UsuarioNotFoundException.class, () -> tareaService.guardarTarea(tareaBase));
    }

    @Test
    void guardarTareaAutoAsignacionProyecto() {
        tareaBase.setAsignadoA(null);
        tareaBase.setAsignadoAInput(null);
        tareaBase.setProyectoId(10L);

        when(proyectoRepository.existsById(10L)).thenReturn(true);
        when(proyectoRepository.findById(10L)).thenReturn(Optional.of(proyectoBase));
        when(tareaRepository.save(any(Tarea.class))).thenReturn(tareaBase);

        Tarea resultado = tareaService.guardarTarea(tareaBase);
        assertNotNull(resultado);
    }

    @Test
    void actualizarTareaExitosamente() {
        Tarea tareaActualizada = new Tarea();
        tareaActualizada.setTitulo("Actualizado");
        tareaActualizada.setEstatus("EN_CURSO");
        tareaActualizada.setPrioridad("MEDIA");
        tareaActualizada.setAsignadoA(1L);

        when(tareaRepository.findById(1L)).thenReturn(Optional.of(tareaBase));
        when(usuarioRepository.existsById(1L)).thenReturn(true);
        when(tareaRepository.save(any(Tarea.class))).thenReturn(tareaBase);

        Tarea resultado = tareaService.actualizarTarea(1L, tareaActualizada);
        assertNotNull(resultado);
    }

    @Test
    void actualizarTareaCompletadaError() {
        tareaBase.setEstatus("COMPLETADA");
        Tarea tareaActualizada = new Tarea();
        when(tareaRepository.findById(1L)).thenReturn(Optional.of(tareaBase));

        assertThrows(IllegalStateException.class, () -> tareaService.actualizarTarea(1L, tareaActualizada));
    }

    @Test
    void eliminarTareaExitosamente() {
        when(tareaRepository.existsById(1L)).thenReturn(true);
        doNothing().when(tareaRepository).deleteById(1L);

        tareaService.eliminarTarea(1L);
        verify(tareaRepository, times(1)).deleteById(1L);
    }

    @Test
    void eliminarTareaNoEncontradaError() {
        when(tareaRepository.existsById(1L)).thenReturn(false);
        assertThrows(TareaNotFoundException.class, () -> tareaService.eliminarTarea(1L));
    }

    @Test
    void finalizarTareaExitosamente() {
        RegistroTiempo rt = new RegistroTiempo();
        rt.setId(1L);
        rt.setTerminadoTiempo(null);

        when(tareaRepository.findById(1L)).thenReturn(Optional.of(tareaBase));
        when(registroTiempoRepository.findByTareaId(1L)).thenReturn(List.of(rt));
        when(tareaRepository.save(any(Tarea.class))).thenReturn(tareaBase);

        Tarea resultado = tareaService.finalizarTarea(1L);
        assertEquals("COMPLETADA", resultado.getEstatus());
    }

    @Test
    void finalizarTareaYaCompletadaError() {
        tareaBase.setEstatus("COMPLETADA");
        when(tareaRepository.findById(1L)).thenReturn(Optional.of(tareaBase));

        assertThrows(IllegalStateException.class, () -> tareaService.finalizarTarea(1L));
    }

    @Test
    void obtenerTareasPorEstatus() {
        when(tareaRepository.findByEstatusIgnoreCase("PENDIENTE")).thenReturn(List.of(tareaBase));
        List<Tarea> resultado = tareaService.obtenerTareasPorEstatus("PENDIENTE");
        assertFalse(resultado.isEmpty());
    }

    @Test
    void obtenerTareasPorAsignadoYEstatus() {
        when(usuarioRepository.existsById(1L)).thenReturn(true);
        when(tareaRepository.findByAsignadoAYEstatusOrdenadas(1L, "PENDIENTE")).thenReturn(List.of(tareaBase));

        List<Tarea> resultado = tareaService.obtenerTareasPorAsignadoYEstatus(1L, "pendiente");
        assertFalse(resultado.isEmpty());
    }

    @Test
    void obtenerTareasPorAsignadoYEstatusUsuarioNoExisteError() {
        when(usuarioRepository.existsById(99L)).thenReturn(false);
        assertThrows(UsuarioNotFoundException.class, () -> tareaService.obtenerTareasPorAsignadoYEstatus(99L, "PENDIENTE"));
    }
}
