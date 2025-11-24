package com.crmpps.Backend.controller;

import com.crmpps.Backend.dto.UsuarioResponse;
import com.crmpps.Backend.service.UsuarioService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/usuario")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping()
    public ResponseEntity<UsuarioResponse> GetUsuario(@RequestHeader Map<String,String> headers){
        String token = headers.get("authorization").substring(7);
        return ResponseEntity.ok(usuarioService.getUsuario(token));
    }
}
