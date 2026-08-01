package com.taskflow.taskflow.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "registros_tiempo")
public class RegistroTiempo {
    //ATRIBUTOS
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "tarea_id", nullable = false)
    private Long tareaId;
    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;
    @Column(name = "inicio_tiempo", nullable = false)
    private LocalDateTime inicioTiempo;
    @Column(name = "terminado_tiempo")
    private LocalDateTime terminadoTiempo;

    //CONSTRUCTOR
    public RegistroTiempo() {
    }

    public RegistroTiempo(Long tareaId, Long usuarioId, LocalDateTime inicioTiempo, LocalDateTime terminadoTiempo) {
        this.tareaId = tareaId;
        this.usuarioId = usuarioId;
        this.inicioTiempo = inicioTiempo;
        this.terminadoTiempo = terminadoTiempo;
    }

    //METODOS

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTareaId() {
        return tareaId;
    }

    public void setTareaId(Long tareaId) {
        this.tareaId = tareaId;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public LocalDateTime getInicioTiempo() {
        return inicioTiempo;
    }

    public void setInicioTiempo(LocalDateTime inicioTiempo) {
        this.inicioTiempo = inicioTiempo;
    }

    public LocalDateTime getTerminadoTiempo() {
        return terminadoTiempo;
    }

    public void setTerminadoTiempo(LocalDateTime terminadoTiempo) {
        this.terminadoTiempo = terminadoTiempo;
    }
}
