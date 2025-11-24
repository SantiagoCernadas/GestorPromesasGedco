package com.crmpps.Backend.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String nombreUsuario;
    private String contrasenia;
}
