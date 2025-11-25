package com.crmpps.Backend.controller;


import com.crmpps.Backend.dto.LoginRequest;
import com.crmpps.Backend.dto.LoginResponse;
import com.crmpps.Backend.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@Tag(name = "Servicios para la gestion de sesión")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Obtener sesión. En caso de credenciales correctas, se devolvera el token de sesión.")
    public ResponseEntity<LoginResponse> login(@RequestHeader Map<String,String> headers,@RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.getToken(headers,loginRequest));
    }
}
