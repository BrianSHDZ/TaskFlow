package com.taskflow.taskflow.service;

import com.taskflow.taskflow.entity.RegistroTiempo;
import com.taskflow.taskflow.exception.RegistroTiempoNotFoundException;
import com.taskflow.taskflow.exception.TareaNotFoundException;
import com.taskflow.taskflow.exception.UsuarioNotFoundException;
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
class RegistroTiempoImpTest {

    @Mock
    private IRegistroTiempoRepository registroTiempoRepository;

    @Mock
    private ITareaRepository tareaRepository;

    @Mock
    private IUsuarioRepository usuarioRepository;

    @InjectMocks
    private RegistroTiempoImp registroTiempoService;

    private RegistroTiempo registroBase;

    @BeforeEach
    void setUp() {
        registroBase = new RegistroTiempo();
        registroBase.setId(1L);
        registroBase.setTareaId(10L);
        registroBase.setUsuarioId(100L);
        registroBase.setInicioTiempo(LocalDateTime.now().minusHours(1));
    }

    @Test
    void iniciarTiempoExitosamente() {
        when(tareaRepository.existsById(10L)).thenReturn(true);
        when(usuarioRepository.existsById(100L)).thenReturn(true);
        when(registroTiempoRepository.save(any(RegistroTiempo.class))).thenReturn(registroBase);

        RegistroTiempo resultado = registroTiempoService.iniciarTiempo(10L, 100L);

        assertNotNull(resultado);
        assertEquals(10L, resultado.getTareaId());
        assertEquals(100L, resultado.getUsuarioId());
        verify(registroTiempoRepository, times(1)).save(any(RegistroTiempo.class));
    }

    @Test
    void iniciarTiempoTareaNoEncontradaError() {
        when(tareaRepository.existsById(10L)).thenReturn(false);

        assertThrows(TareaNotFoundException.class, () -> registroTiempoService.iniciarTiempo(10L, 100L));
        verify(usuarioRepository, never()).existsById(anyLong());
    }

    @Test
    void iniciarTiempoUsuarioNoEncontradoError() {
        when(tareaRepository.existsById(10L)).thenReturn(true);
        when(usuarioRepository.existsById(100L)).thenReturn(false);

        assertThrows(UsuarioNotFoundException.class, () -> registroTiempoService.iniciarTiempo(10L, 100L));
    }

    @Test
    void detenerTiempoExitosamente() {
        registroBase.setTerminadoTiempo(null);
        when(registroTiempoRepository.findById(1L)).thenReturn(Optional.of(registroBase));
        when(registroTiempoRepository.save(any(RegistroTiempo.class))).thenReturn(registroBase);

        RegistroTiempo resultado = registroTiempoService.detenerTiempo(1L);

        assertNotNull(resultado);
        assertNotNull(resultado.getTerminadoTiempo());
        verify(registroTiempoRepository, times(1)).save(registroBase);
    }

    @Test
    void detenerTiempoNoEncontradoError() {
        when(registroTiempoRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RegistroTiempoNotFoundException.class, () -> registroTiempoService.detenerTiempo(99L));
    }

    @Test
    void detenerTiempoYaDetenidoError() {
        registroBase.setTerminadoTiempo(LocalDateTime.now());
        when(registroTiempoRepository.findById(1L)).thenReturn(Optional.of(registroBase));

        assertThrows(IllegalStateException.class, () -> registroTiempoService.detenerTiempo(1L));
        verify(registroTiempoRepository, never()).save(any(RegistroTiempo.class));
    }

    @Test
    void obtenerTiempoPorTareaIdExitosamente() {
        when(tareaRepository.existsById(10L)).thenReturn(true);
        when(registroTiempoRepository.findByTareaId(10L)).thenReturn(List.of(registroBase));

        List<RegistroTiempo> resultado = registroTiempoService.obtenerTiempoPorTareaId(10L);

        assertFalse(resultado.isEmpty());
        assertEquals(1, resultado.size());
    }

    @Test
    void obtenerTiempoPorTareaIdNoEncontradaError() {
        when(tareaRepository.existsById(10L)).thenReturn(false);

        assertThrows(TareaNotFoundException.class, () -> registroTiempoService.obtenerTiempoPorTareaId(10L));
    }

    @Test
    void obtenerTiempoPorUsuarioIdExitosamente() {
        when(usuarioRepository.existsById(100L)).thenReturn(true);
        when(registroTiempoRepository.findByUsuarioId(100L)).thenReturn(List.of(registroBase));

        List<RegistroTiempo> resultado = registroTiempoService.obtenerTiempoPorUsuarioId(100L);

        assertFalse(resultado.isEmpty());
        assertEquals(100L, resultado.get(0).getUsuarioId());
    }

    @Test
    void obtenerTiempoPorUsuarioIdNoEncontradoError() {
        when(usuarioRepository.existsById(100L)).thenReturn(false);

        assertThrows(UsuarioNotFoundException.class, () -> registroTiempoService.obtenerTiempoPorUsuarioId(100L));
    }
}
