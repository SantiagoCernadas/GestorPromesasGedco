package com.crmpps.Backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
public class EstadisticaResponse {
    private Integer cantPromesas;
    private Integer cantPromesasMLA;
    private Integer cantPromesasMLM;
    private Integer cantPromesasMLC;
    private Integer cantPromesasCumplidas;
    private Integer cantPromesasIncumplidas;
    private Integer cantPromesasEnCurso;
    private Integer cantPromesasDuplicadas;
    private Integer cantPromesasDuplicadasIncumplidas;
    private Integer cantPromesasDuplicadasCumplidas;
    private Integer cantPromesasDuplicadasEnCurso;

    public EstadisticaResponse() {
        cantPromesas = 0;
        cantPromesasMLA = 0;
        cantPromesasMLM = 0;
        cantPromesasMLC = 0;
        cantPromesasCumplidas = 0;
        cantPromesasIncumplidas = 0;
        cantPromesasEnCurso = 0;
        cantPromesasDuplicadas = 0;
        cantPromesasDuplicadasCumplidas = 0;
        cantPromesasDuplicadasIncumplidas = 0;
        cantPromesasDuplicadasEnCurso = 0;
    }
}
