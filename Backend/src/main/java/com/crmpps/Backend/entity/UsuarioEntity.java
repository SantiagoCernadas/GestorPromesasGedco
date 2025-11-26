package com.crmpps.Backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity(name = "usuario")
public class UsuarioEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 25)
    @Column(unique = true,name = "nombre_usuario")
    private String nombreUsuario;

    @NotBlank
    private String contrasenia;

    @Enumerated(EnumType.STRING)
    private Rol rol;

    @NotBlank
    @Size(max = 25)
    private String nombre;
}
