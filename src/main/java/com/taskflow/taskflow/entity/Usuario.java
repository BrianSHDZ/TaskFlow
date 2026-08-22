package com.taskflow.taskflow.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "usuarios")
public class Usuario {
    //ATRIBUTOS
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank(message = "El nombre de usuario no puede estar vacio")
    @Column(name = "nombre_usuario", nullable = false,length = 50)
    private String nombreUsuario;
    @NotBlank(message = "El correo no puede estar vacio")
    @Email(message = "El correo esta mal escrito")
    @Column(name = "correo", nullable = false, length = 100, unique = true)
    private String correo;
    @NotBlank(message = "La contrasena no puede estar vacia")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Size(min = 12, max = 200, message = "La contrasena debe tener entre 12 a 200 caracteres")
    @Column(name = "contrasena",  nullable = false, length = 250)
    private String contrasena;
    //@NotNull(message = "Debe asignar un rol al usuario")
    @ManyToOne
    @JoinColumn(name = "rol_id", nullable = false)
    private Rol rol; //Creamos un objeto de tipo rol el cual hace referencia al id de roles(ahi se define el rol de cada usuario)

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
