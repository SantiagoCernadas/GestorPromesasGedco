package com.crmpps.Backend.dto;

import com.crmpps.Backend.entity.Rol;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioRequest {
    @NotBlank
    private String nombre;

    @NotBlank
    private String nombreUsuario;

    @Enumerated(EnumType.STRING)
    @NotBlank
    private Rol rol;

    @NotBlank
    private String contrasenia;
}
