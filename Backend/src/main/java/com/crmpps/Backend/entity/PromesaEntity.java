package com.crmpps.Backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity(name = "promesa_pago")
public class PromesaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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

    @ManyToOne
    @JoinColumn(name = "operador_id")
    private UsuarioEntity operador;

}
