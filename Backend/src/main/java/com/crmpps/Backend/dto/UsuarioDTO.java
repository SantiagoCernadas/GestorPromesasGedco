package com.crmpps.Backend.dto;

import com.crmpps.Backend.entity.Rol;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioDTO {
    @NotBlank
    private String nombreUsuario;

    @NotBlank
    private  String contrasenia;

    @Enumerated(EnumType.STRING)
    private Rol rol;

    @NotBlank
    private String nombre;
}
