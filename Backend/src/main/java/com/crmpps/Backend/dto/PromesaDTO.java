package com.crmpps.Backend.dto;

import com.crmpps.Backend.entity.UsuarioEntity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PromesaDTO {

    @NotNull
    private Long idUsuarioML;
    @NotNull
    private Long numCaso;
    @NotNull
    private Double monto;
    @NotBlank
    private String site;
    @NotBlank
    private String canal;
    @NotBlank
    private String tipoAcuerdo;
    @NotBlank
    private String cumplimiento;
    @NotNull
    private LocalDate fechaCarga;
    @NotNull
    private LocalDate fechaPago;
    @NotNull
    private Long operador;
}
