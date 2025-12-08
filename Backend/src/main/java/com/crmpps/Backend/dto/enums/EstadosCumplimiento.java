package com.crmpps.Backend.dto.enums;

public enum EstadosCumplimiento {
    EN_CURSO("En curso"),
    CUMPLIDA("Cumplida"),
    INCUMPLIDA("Incumplida");

    private final String estado;

    EstadosCumplimiento(String estado) {
        this.estado = estado;
    }
    public String getEstado() {
        return estado;
    }
}
