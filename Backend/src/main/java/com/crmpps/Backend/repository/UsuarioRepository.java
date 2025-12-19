package com.crmpps.Backend.repository;

import com.crmpps.Backend.entity.UsuarioEntity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends CrudRepository<UsuarioEntity,Long> {


    Optional<UsuarioEntity> findByNombreUsuario(String nombreUsuario);

    @Query(value = "SELECT u FROM usuario u Where u.nombreUsuario = ?1")
    Optional<UsuarioEntity> getNombreUsuario(String nombreUsuario);

    @Query(value = "Select u from usuario u where u.rol = 'OPERADOR' order by u.nombre")
    List<UsuarioEntity> getOperadores();

    @Query(value = "select u from usuario u where (u.nombreUsuario like %?1% or u.nombre like %?1%) and (u.rol = 'OPERADOR' or u.rol = 'SUPERVISOR') order by u.rol,u.nombre")
    List<UsuarioEntity> getUsuarios(String nombre);
}
