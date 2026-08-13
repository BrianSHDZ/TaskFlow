package com.taskflow.taskflow.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Entity
@Table(name = "tareas")
public class Tarea {
    //ATRIBUTOS
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank(message = "El titulo no puede estar vacio")
    @Column(name = "titulo", nullable = false,  length = 100)
    private String titulo;
    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;
    @Column(name = "estatus", nullable = false, length = 20)
    private String estatus;
    @Column(name = "prioridad",  nullable = false, length = 20)
    private String prioridad;
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    @Column(name = "vencimiento")
    private LocalDateTime vencimiento;
    //@NotNull(message = "Id del proyecto no puede estar nulo")
    @Column(name = "proyecto_id", nullable = true)
    private Long proyectoId;
    @NotNull(message = "La asignacion no puede estar nulo")
    @Column(name = "asignado_a")
    private Long asignadoA;
    @Column(name = "creado_en", insertable = false, updatable = false)
    private LocalDateTime creadoEn;

    //CONSTRUCTOR
    public Tarea(){
    }

    public Tarea(String titulo, String descripcion, String estatus, String prioridad, LocalDateTime vencimiento, Long proyectoId, Long asignadoA) {
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.estatus = estatus;
        this.prioridad = prioridad;
        this.vencimiento = vencimiento;
        this.proyectoId = proyectoId;
        this.asignadoA = asignadoA;
    }

    //METODOS

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getEstatus() {
        return estatus;
    }

    public void setEstatus(String estatus) {
        this.estatus = estatus;
    }

    public String getPrioridad() {
        return prioridad;
    }

    public void setPrioridad(String prioridad) {
        this.prioridad = prioridad;
    }

    public LocalDateTime getVencimiento() {
        return vencimiento;
    }

    public void setVencimiento(LocalDateTime vencimiento) {
        this.vencimiento = vencimiento;
    }

    public Long getProyectoId() {
        return proyectoId;
    }

    public void setProyectoId(Long proyectoId) {
        this.proyectoId = proyectoId;
    }

    public Long getAsignadoA() {
        return asignadoA;
    }

    public void setAsignadoA(Long asignadoA) {
        this.asignadoA = asignadoA;
    }

    public LocalDateTime getCreadoEn() {
        return creadoEn;
    }

    public void setCreadoEn(LocalDateTime creadoEn) {
        this.creadoEn = creadoEn;
    }
}
