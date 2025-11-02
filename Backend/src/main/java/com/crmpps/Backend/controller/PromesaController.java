package com.crmpps.Backend.controller;

import com.crmpps.Backend.dto.PromesaDTO;
import com.crmpps.Backend.dto.PromesaResponse;
import com.crmpps.Backend.entity.PromesaEntity;
import com.crmpps.Backend.entity.UsuarioEntity;
import com.crmpps.Backend.service.PromesaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

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

    @GetMapping("/usuario/{idOperador}")
    public ResponseEntity<List<PromesaResponse>> getPromesasOperadorFiltros(@RequestParam(required = true) Integer caso,
                                                                        @RequestParam(required = false) Integer usuarioML,
                                                                        @RequestParam(required = false) String canal,
                                                                        @RequestParam(required = false) String site,
                                                                        @RequestParam(required = false) String tipoAcuerdo,
                                                                        @RequestParam(required = false) String tipoCumplimiento,
                                                                        @RequestParam(required = false) LocalDate fechaCargaDesde,
                                                                        @RequestParam(required = false) LocalDate fechaCargaHasta,
                                                                        @RequestParam(required = false) Integer operador,
                                                                        @RequestParam(required = false) Boolean duplica){

        return ResponseEntity.ok(promesaService.getPromesasOperadorFiltros(caso, usuarioML, canal, site, tipoAcuerdo, tipoCumplimiento,
                fechaCargaDesde, fechaCargaHasta, operador, duplica));
    }
}
