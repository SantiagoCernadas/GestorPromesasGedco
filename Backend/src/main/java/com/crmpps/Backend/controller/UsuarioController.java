package com.crmpps.Backend.controller;

import com.crmpps.Backend.dto.ContraseniaRequest;
import com.crmpps.Backend.dto.ModificarUsuarioRequest;
import com.crmpps.Backend.dto.UsuarioRequest;
import com.crmpps.Backend.dto.UsuarioResponse;
import com.crmpps.Backend.exception.LogicaInvalidaException;
import com.crmpps.Backend.exception.NoAutorizadoException;
import com.crmpps.Backend.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
    @Operation(summary = "Obtener lista de usuarios, puede filtrarse por nombre y nombre de usuario. lista ordenada por ROL y Nombre")
    public ResponseEntity<List<UsuarioResponse>> getUsuariosFiltros(@RequestHeader Map<String,String> headers,
                                                             @RequestParam(required = false) String nombre) throws NoAutorizadoException {
        return ResponseEntity.ok(usuarioService.getUsuarios(headers,nombre));
    }

    @PostMapping()
    @Operation(summary = "Agregar nuevo usuario.")
    public ResponseEntity<UsuarioResponse> agregarUsuario(@RequestHeader Map<String,String> headers, @RequestBody UsuarioRequest usuarioRequest) throws LogicaInvalidaException, NoAutorizadoException {
        return ResponseEntity.ok(usuarioService.agregarUsuario(headers,usuarioRequest));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar Usuario por ID.")
    public ResponseEntity<UsuarioResponse> eliminarUsuario(@RequestHeader Map<String,String> headers,@PathVariable Long id) throws NoAutorizadoException, LogicaInvalidaException {
        usuarioService.eliminarUsuario(headers,id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PutMapping("{id}")
    @Operation(summary = "Modificar Usuario por ID.")
    public ResponseEntity<UsuarioResponse> modificarUsuario(@RequestHeader Map<String,String> headers,
                                                            @PathVariable Long id,
                                                            @RequestBody ModificarUsuarioRequest request) throws NoAutorizadoException, LogicaInvalidaException {

        return ResponseEntity.ok(usuarioService.modificarUsuario(headers,id,request));
    }

    @PatchMapping("{id}/contrasenia")
    @Operation(summary = "Modificar Contraseña del usuario por ID.")
    public ResponseEntity<UsuarioResponse> modificarContraseniaUsuario(@RequestHeader Map<String,String> headers,
                                                            @PathVariable Long id,
                                                            @RequestBody ContraseniaRequest request) throws NoAutorizadoException, LogicaInvalidaException {

        usuarioService.modificarContraseniaUsuario(headers,id,request);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @GetMapping("/operadores")
    @Operation(summary = "Obtener lista de operadores para Supervisor y Admin. Si la solicitud es de un operador, " +
            "se devuelve unicamente un objeto con los datos del usuario actual.")
    public ResponseEntity<List<UsuarioResponse>> GetOperadores(@RequestHeader Map<String,String> headers){
        return  ResponseEntity.ok(usuarioService.getOperadores(headers));
    }
}
