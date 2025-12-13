package com.crmpps.Backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginRequest {
    private String nombreUsuario;
    private String contrasenia;
}
