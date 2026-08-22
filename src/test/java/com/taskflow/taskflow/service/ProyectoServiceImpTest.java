package com.taskflow.taskflow.service;

import com.taskflow.taskflow.dto.ProyectoDTO;
import com.taskflow.taskflow.entity.Proyecto;
import com.taskflow.taskflow.entity.Tarea;
import com.taskflow.taskflow.exception.DatosInvalidosException;
import com.taskflow.taskflow.exception.ProyectoNotFoundException;
import com.taskflow.taskflow.exception.ProyectoWithTareaException;
import com.taskflow.taskflow.exception.UsuarioNotFoundException;
import com.taskflow.taskflow.repository.IProyectoRepository;
import com.taskflow.taskflow.repository.ITareaRepository;
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
class ProyectoServiceImpTest {

    @Mock
    private IProyectoRepository proyectoRepository;

    @Mock
    private IUsuarioRepository usuarioRepository;

    @Mock
    private ITareaRepository tareaRepository;

    @InjectMocks
    private ProyectoServiceImp proyectoService;

    private Proyecto proyectoBase;

    @BeforeEach
    void setUp() {
        proyectoBase = new Proyecto();
        proyectoBase.setId(1L);
        proyectoBase.setTitulo("Sistema TaskFlow");
        proyectoBase.setDescripcion("Gestor de tareas");
        proyectoBase.setCreadoPor(10L);
        proyectoBase.setEstatus("ACTIVO");
    }

    @Test
    void listarProyectos() {
        when(proyectoRepository.findAll()).thenReturn(List.of(proyectoBase));
        List<Proyecto> resultado = proyectoService.listarProyectos();
        assertFalse(resultado.isEmpty());
        assertEquals(1, resultado.size());
    }

    @Test
    void guardarProyectoExitosamente() {
        when(usuarioRepository.existsById(10L)).thenReturn(true);
        when(proyectoRepository.save(any(Proyecto.class))).thenReturn(proyectoBase);

        Proyecto resultado = proyectoService.guardarProyecto(proyectoBase);

        assertNotNull(resultado);
        assertEquals("Sistema TaskFlow", resultado.getTitulo());
    }

    @Test
    void guardarProyectoTituloNuloError() {
        proyectoBase.setTitulo(null);
        assertThrows(DatosInvalidosException.class, () -> proyectoService.guardarProyecto(proyectoBase));
    }

    @Test
    void guardarProyectoTituloVacioError() {
        proyectoBase.setTitulo("   ");
        assertThrows(DatosInvalidosException.class, () -> proyectoService.guardarProyecto(proyectoBase));
    }

    @Test
    void guardarProyectoCreadorNuloError() {
        proyectoBase.setCreadoPor(null);
        assertThrows(UsuarioNotFoundException.class, () -> proyectoService.guardarProyecto(proyectoBase));
    }

    @Test
    void guardarProyectoUsuarioNoExisteError() {
        when(usuarioRepository.existsById(10L)).thenReturn(false);
        assertThrows(UsuarioNotFoundException.class, () -> proyectoService.guardarProyecto(proyectoBase));
    }

    @Test
    void obtenerProyectoPorIdExitosamente() {
        when(proyectoRepository.findById(1L)).thenReturn(Optional.of(proyectoBase));
        Proyecto resultado = proyectoService.obtenerProyectoPorId(1L);
        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
    }

    @Test
    void obtenerProyectoPorIdNoEncontradoError() {
        when(proyectoRepository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(ProyectoNotFoundException.class, () -> proyectoService.obtenerProyectoPorId(99L));
    }

    @Test
    void obtenerProyectoPorUsuarioExitosamente() {
        when(usuarioRepository.existsById(10L)).thenReturn(true);
        when(proyectoRepository.findByCreadoPor(10L)).thenReturn(List.of(proyectoBase));

        List<Proyecto> resultado = proyectoService.obtenerProyectoPorUsuario(10L);
        assertFalse(resultado.isEmpty());
    }

    @Test
    void obtenerProyectoPorUsuarioNuloError() {
        assertThrows(UsuarioNotFoundException.class, () -> proyectoService.obtenerProyectoPorUsuario(null));
    }

    @Test
    void obtenerProyectoPorUsuarioNoExisteError() {
        when(usuarioRepository.existsById(99L)).thenReturn(false);
        assertThrows(UsuarioNotFoundException.class, () -> proyectoService.obtenerProyectoPorUsuario(99L));
    }

    @Test
    void actualizarProyectoExitosamente() {
        Proyecto proyectoActualizado = new Proyecto();
        proyectoActualizado.setTitulo("Nuevo Título");
        proyectoActualizado.setDescripcion("Nueva Descripción");
        proyectoActualizado.setCreadoPor(10L);
        proyectoActualizado.setEstatus("COMPLETADO");

        when(proyectoRepository.findById(1L)).thenReturn(Optional.of(proyectoBase));
        when(usuarioRepository.existsById(10L)).thenReturn(true);
        when(proyectoRepository.save(any(Proyecto.class))).thenReturn(proyectoBase);

        Proyecto resultado = proyectoService.actualizarProyecto(1L, proyectoActualizado);
        assertNotNull(resultado);
    }

    @Test
    void actualizarProyectoNoEncontradoError() {
        when(proyectoRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(ProyectoNotFoundException.class, () -> proyectoService.actualizarProyecto(1L, new Proyecto()));
    }

    @Test
    void actualizarProyectoUsuarioInexistenteError() {
        Proyecto proyectoActualizado = new Proyecto();
        proyectoActualizado.setCreadoPor(99L);

        when(proyectoRepository.findById(1L)).thenReturn(Optional.of(proyectoBase));
        when(usuarioRepository.existsById(99L)).thenReturn(false);

        assertThrows(UsuarioNotFoundException.class, () -> proyectoService.actualizarProyecto(1L, proyectoActualizado));
    }

    @Test
    void eliminarProyectoExitosamente() {
        when(proyectoRepository.findById(1L)).thenReturn(Optional.of(proyectoBase));
        when(tareaRepository.existsByProyectoId(1L)).thenReturn(false);
        doNothing().when(proyectoRepository).delete(proyectoBase);

        assertDoesNotThrow(() -> proyectoService.eliminarProyecto(1L));
        verify(proyectoRepository, times(1)).delete(proyectoBase);
    }

    @Test
    void eliminarProyectoConTareasError() {
        when(proyectoRepository.findById(1L)).thenReturn(Optional.of(proyectoBase));
        when(tareaRepository.existsByProyectoId(1L)).thenReturn(true);

        assertThrows(ProyectoWithTareaException.class, () -> proyectoService.eliminarProyecto(1L));
        verify(proyectoRepository, never()).delete(any());
    }

    @Test
    void obtenerProyectosConConteoPorUsuarioExitosamente() {
        ProyectoDTO dto = new ProyectoDTO(1L, "Título", "Desc", 10L, 5L, 3L);
        when(usuarioRepository.existsById(10L)).thenReturn(true);
        when(proyectoRepository.obtenerProyectosConConteoPorUsuarioOptimizada(10L)).thenReturn(List.of(dto));

        List<ProyectoDTO> dtos = proyectoService.obtenerProyectosConConteoPorUsuario(10L);

        assertFalse(dtos.isEmpty());
        assertEquals(5, dtos.get(0).getTotalTareas());
        assertEquals(3, dtos.get(0).getTareasCompletadas());
    }

    @Test
    void obtenerProyectosCompletadosExitosamente() {
        when(usuarioRepository.existsById(10L)).thenReturn(true);
        when(proyectoRepository.findByCreadoPorAndEstatus(10L, "COMPLETADO")).thenReturn(List.of(proyectoBase));

        List<Proyecto> resultado = proyectoService.obtenerProyectosCompletados(10L);
        assertFalse(resultado.isEmpty());
    }

    @Test
    void obtenerProyectosCompletadosUsuarioNuloError() {
        assertThrows(UsuarioNotFoundException.class, () -> proyectoService.obtenerProyectosCompletados(null));
    }

    @Test
    void obtenerProyectosCompletadosUsuarioNoExisteError() {
        when(usuarioRepository.existsById(99L)).thenReturn(false);
        assertThrows(UsuarioNotFoundException.class, () -> proyectoService.obtenerProyectosCompletados(99L));
    }
}