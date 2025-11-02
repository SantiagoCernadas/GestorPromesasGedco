package com.crmpps.Backend.controller;

import com.crmpps.Backend.dto.PromesaDTO;
import com.crmpps.Backend.entity.PromesaEntity;
import com.crmpps.Backend.entity.UsuarioEntity;
import com.crmpps.Backend.service.PromesaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/promesa")
@Tag(name = "Servicios para la promesas")
public class PromesaController {

    @Autowired
    private PromesaService promesaService;

    @Operation(summary = "Agregar una nueva promesa.")
    @PostMapping()
    public ResponseEntity<PromesaEntity> agregarPromesa(@Valid @RequestBody PromesaDTO promesaDTO){
        return ResponseEntity.ok(promesaService.agregarUsuario(promesaDTO));
    }
}
