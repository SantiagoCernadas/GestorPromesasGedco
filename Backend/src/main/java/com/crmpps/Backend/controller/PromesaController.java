package com.crmpps.Backend.controller;

import com.crmpps.Backend.dto.PromesaDTO;
import com.crmpps.Backend.dto.PromesaResponse;
import com.crmpps.Backend.entity.PromesaEntity;
import com.crmpps.Backend.entity.UsuarioEntity;
import com.crmpps.Backend.exception.NoAutorizadoException;
import com.crmpps.Backend.service.PromesaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/promesa")
@Tag(name = "Servicios para la gestion de promesas")
public class PromesaController {

    @Autowired
    private PromesaService promesaService;

    @Operation(summary = "Agregar una nueva promesa.")
    @PostMapping()
    public ResponseEntity<PromesaEntity> agregarPromesa(@RequestHeader Map<String,String> headers,@Valid @RequestBody PromesaDTO promesaDTO) throws NoAutorizadoException {
        return ResponseEntity.status(HttpStatus.CREATED).body(promesaService.agregarPromesa(headers,promesaDTO));
    }

    @Operation(summary = "Obtener promesa por ID.")
    @GetMapping("/{id}")
    public ResponseEntity<PromesaResponse> obtenerPromesa(@RequestHeader Map<String,String> headers,@PathVariable Long id) throws NoAutorizadoException {
        return ResponseEntity.ok(promesaService.obtenerPromesa(headers,id));
    }

    @Operation(summary = "Obtener conjunto de promesas mediante filtros.")
    @GetMapping()
    public ResponseEntity<List<PromesaResponse>> getPromesasOperadorFiltros(@RequestHeader Map<String,String> headers,
                                                                        @RequestParam(required = false) Integer caso,
                                                                        @RequestParam(required = false) Integer usuarioML,
                                                                        @RequestParam(required = false) String canal,
                                                                        @RequestParam(required = false) String site,
                                                                        @RequestParam(required = false) String tipoAcuerdo,
                                                                        @RequestParam(required = false) String tipoCumplimiento,
                                                                        @RequestParam(required = false) LocalDate fechaCargaDesde,
                                                                        @RequestParam(required = false) LocalDate fechaCargaHasta,
                                                                        @RequestParam(required = false) Long operador,
                                                                        @RequestParam(required = false) Boolean duplica)    throws NoAutorizadoException {

        return ResponseEntity.ok(promesaService.getPromesasOperadorFiltros(headers,caso, usuarioML, canal, site, tipoAcuerdo, tipoCumplimiento,
                fechaCargaDesde, fechaCargaHasta, operador, duplica));
    }

    @Operation(summary = "Eliminar promesa por ID.")
    @DeleteMapping("/{id}")
    public ResponseEntity<PromesaResponse> eliminarPromesa(@RequestHeader Map<String,String> headers,@PathVariable Long id) throws NoAutorizadoException {
        promesaService.eliminarPromesa(headers,id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
