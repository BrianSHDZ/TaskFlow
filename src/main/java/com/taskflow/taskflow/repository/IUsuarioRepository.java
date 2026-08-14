package com.taskflow.taskflow.repository;

import com.taskflow.taskflow.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IUsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByCorreo(String correo);
    Optional<Usuario> findByNombreUsuarioIgnoreCase(String nombreUsuario);
    Boolean existsByCorreo(String correo);
    boolean existsByRolId(Integer rolId);
    @Query("SELECT u FROM Usuario u WHERE u.nombreUsuario LIKE %:filtro% OR u.correo LIKE %:filtro%")
    List<Usuario> buscarPorNombreOCorreo(@Param("filtro") String filtro);
}
