package com.taskflow.taskflow.dto;

public class ProyectoDTO {
    private Long id;
    private String titulo;
    private String descripcion;
    private Long creadoPor;
    private long totalTareas;
    private long tareasCompletadas;

    public ProyectoDTO(Long id, String titulo, String descripcion, Long creadoPor, long totalTareas, long tareasCompletadas) {
        this.id = id;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.creadoPor = creadoPor;
        this.totalTareas = totalTareas;
        this.tareasCompletadas = tareasCompletadas;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public String getTitulo() { return titulo; }
    public String getDescripcion() { return descripcion; }
    public Long getCreadoPor() { return creadoPor; }
    public long getTotalTareas() { return totalTareas; }
    public long getTareasCompletadas() { return tareasCompletadas; }
}
