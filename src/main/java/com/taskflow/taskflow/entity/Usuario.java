package com.taskflow.taskflow.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "usuarios")
public class Usuario {
    //ATRIBUTOS
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "nombre_usuario", nullable = false,length = 50, unique = true)
    private String nombreUsuario;
    @Column(name = "correo", nullable = false, length = 100, unique = true)
    private String correo;
    @Column(name = "contrasena",  nullable = false, length = 250)
    private String contrasena;
    @ManyToOne
    @JoinColumn(name = "rol_id", nullable = false)
    private Rol rol;

    //CONSTRUCTOR
    public Usuario() {
    }

    public Usuario(String nombreUsuario, String correo, String contrasena, Rol rol) {
        this.nombreUsuario = nombreUsuario;
        this.correo = correo;
        this.contrasena = contrasena;
        this.rol = rol;
    }

    //METODOS

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getContrasena() {
        return contrasena;
    }

    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }
}
