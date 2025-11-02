package com.crmpps.Backend.repository;

import com.crmpps.Backend.entity.UsuarioEntity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends CrudRepository<UsuarioEntity,Long> {


    Optional<UsuarioEntity> findByNombreUsuario(String nombreUsuario);

    @Query(value = "SELECT u FROM usuario u Where u.nombreUsuario = ?1")
    Optional<UsuarioEntity> getNombreUsuario(String nombreUsuario);
}
