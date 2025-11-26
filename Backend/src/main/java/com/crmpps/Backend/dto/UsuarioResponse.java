package com.crmpps.Backend.dto;

import com.crmpps.Backend.entity.Rol;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioResponse {
    private Long id;
    private String nombreUsuario;
    @Enumerated(EnumType.STRING)
    private Rol rol;
    private String nombre;
}
