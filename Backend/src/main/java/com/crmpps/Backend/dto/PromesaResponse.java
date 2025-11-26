package com.crmpps.Backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PromesaResponse {
    private Long id;
    private Long idUsuarioML;
    private Long numCaso;
    private Double monto;
    private String site;
    private String canal;
    private String tipoAcuerdo;
    private String cumplimiento;
    private LocalDate fechaCarga;
    private LocalDate fechaPago;
    private String operador;
}
