package com.crmpps.Backend.controller;

import com.crmpps.Backend.dto.UsuarioResponse;
import com.crmpps.Backend.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/usuario")
@Tag(name = "Servicios para la gestion de usuarios.")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping()
    @Operation(summary = "Obtener los datos del usuario logeado.")
    public ResponseEntity<UsuarioResponse> GetUsuario(@RequestHeader Map<String,String> headers){
        return ResponseEntity.ok(usuarioService.getUsuario(headers));
    }

    @GetMapping("/operadores")
    @Operation(summary = "Obtener lista de operadores para Supervisor. Si la solicitud es de un operador, " +
            "se devuelve unicamente un objeto con los datos del usuario actual.")
    public ResponseEntity<List<UsuarioResponse>> GetOperadores(@RequestHeader Map<String,String> headers){
        return  ResponseEntity.ok(usuarioService.getOperadores(headers));
    }
}
