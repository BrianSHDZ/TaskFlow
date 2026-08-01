package com.taskflow.taskflow.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "roles")
public class Rol {
    //ATRIBUTOS
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = "nombre", nullable = false, length = 20, unique = true)
    private String nombre;

    //CONSTRUCTOR
    public Rol(){
    }

    public Rol(String nombre){
        this.nombre = nombre;
    }

    //METODOS
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}
