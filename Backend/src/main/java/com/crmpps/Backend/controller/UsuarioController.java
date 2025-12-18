package com.crmpps.Backend.controller;

import com.crmpps.Backend.dto.UsuarioResponse;
import com.crmpps.Backend.exception.NoAutorizadoException;
import com.crmpps.Backend.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/usuario")
@Tag(name = "Servicios para la gestion de usuarios.")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping("/datos")
    @Operation(summary = "Obtener los datos del usuario logeado.")
    public ResponseEntity<UsuarioResponse> GetDatosUsuario(@RequestHeader Map<String,String> headers){
        return ResponseEntity.ok(usuarioService.getDatosUsuario(headers));
    }

    @GetMapping()
    public ResponseEntity<List<UsuarioResponse>> getUsuariosFiltros(@RequestHeader Map<String,String> headers,
                                                             @RequestParam(required = false) String nombre) throws NoAutorizadoException {
        return ResponseEntity.ok(usuarioService.getUsuarios(headers,nombre));
    }

    @GetMapping("/operadores")
    @Operation(summary = "Obtener lista de operadores para Supervisor y Admin. Si la solicitud es de un operador, " +
            "se devuelve unicamente un objeto con los datos del usuario actual.")
    public ResponseEntity<List<UsuarioResponse>> GetOperadores(@RequestHeader Map<String,String> headers){
        return  ResponseEntity.ok(usuarioService.getOperadores(headers));
    }
}
