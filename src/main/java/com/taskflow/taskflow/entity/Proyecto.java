package com.taskflow.taskflow.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Entity
@Table(name = "proyectos")
public class Proyecto {
    //ATRIBUTOS
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank(message = "El titulo del proyecto no puede ir vacio")
    @Column(name = "titulo", nullable = false, length = 120)
    private String titulo;
    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;
    @NotNull(message = "El id del usuario no puede estar nulo")
    @Column(name = "creado_por", nullable = false)
    private Long creadoPor;
    @Column(name = "creado_en", insertable = false,  updatable = false)
    private LocalDateTime creadoEn;
    @Column(name = "estatus", length = 20)
    private String estatus = "ACTIVO";

    //CONSTRUCTOR
    public Proyecto(){
    }

    public Proyecto(String titulo, String descripcion, Long creadoPor) {
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.creadoPor = creadoPor;
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

    public Long getCreadoPor() {
        return creadoPor;
    }

    public void setCreadoPor(Long creadoPor) {
        this.creadoPor = creadoPor;
    }

    public LocalDateTime getCreadoEn() {
        return creadoEn;
    }

    public void setCreadoEn(LocalDateTime creadoEn) {
        this.creadoEn = creadoEn;
    }

    public String getEstatus() { return estatus; }

    public void setEstatus(String estatus) { this.estatus = estatus; }
}
