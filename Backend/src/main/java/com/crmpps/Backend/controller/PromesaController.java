package com.crmpps.Backend.controller;

import com.crmpps.Backend.dto.EstadisticaResponse;
import com.crmpps.Backend.dto.PromesaExcelRequest;
import com.crmpps.Backend.dto.PromesaRequest;
import com.crmpps.Backend.dto.PromesaResponse;
import com.crmpps.Backend.exception.LogicaInvalidaException;
import com.crmpps.Backend.exception.NoAutorizadoException;
import com.crmpps.Backend.service.PromesaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/promesa")
@Tag(name = "Servicios para la gestion de promesas")
public class PromesaController {

    @Autowired
    private PromesaService promesaService;

    @Operation(summary = "Agregar una nueva promesa.")
    @PostMapping()
    public ResponseEntity<PromesaResponse> agregarPromesa(@RequestHeader Map<String,String> headers,@Valid @RequestBody PromesaRequest promesaRequest) throws NoAutorizadoException, LogicaInvalidaException {
        return ResponseEntity.status(HttpStatus.CREATED).body(promesaService.agregarPromesa(headers, promesaRequest));
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

    @Operation(summary = "Modificar una promesa por ID")
    @PutMapping("/{id}")
    public ResponseEntity <PromesaResponse> modificarPromesa(@RequestHeader Map<String,String> headers,
                                                             @PathVariable Long id,
                                                             @Valid @RequestBody PromesaRequest promesaRequest) throws NoAutorizadoException, LogicaInvalidaException {
        return ResponseEntity.ok(promesaService.modificarPromesa(headers,id, promesaRequest));
    }

    @PostMapping("/estadisticas")
    @Operation(summary = "Información relevante de la tabla de promesa ingresada.")
    public ResponseEntity<EstadisticaResponse> getEstadisticas(@RequestHeader Map<String,String> headers,
                                                               @Valid @RequestBody List<PromesaExcelRequest> promesas) throws NoAutorizadoException, LogicaInvalidaException {
        return ResponseEntity.ok(promesaService.getEstadisticas(headers,promesas));
    }

    @PostMapping("/excel")
    @Operation(summary = "Exportar la tabla ingresada a un archivo en formato Excel (.xlsx).")
    public ResponseEntity<byte[]> getExcelTabla(@RequestHeader Map<String,String> headers,
                                                @Valid @RequestBody List<PromesaExcelRequest> promesas) throws IOException, LogicaInvalidaException {

        return ResponseEntity.ok()
                .header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                .header("Content-Disposition", "attachment; filename=promesas.xlsx")
                .body(promesaService.getExcelTabla(headers,promesas));
    }

}
