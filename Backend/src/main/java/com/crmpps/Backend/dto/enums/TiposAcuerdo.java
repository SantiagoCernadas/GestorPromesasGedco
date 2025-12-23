package com.crmpps.Backend.dto.enums;

public enum TiposAcuerdo {
    PAGO_TOTAL("Pago total"),
    CONDONACION("Condonación"),
    PARCELAMENTO("Parcelamento"),
    PAGO_PARCIAL("Pago parcial");

    private final String tipoAcuerdo;

    TiposAcuerdo(String tipoAcuerdo) {
        this.tipoAcuerdo = tipoAcuerdo;
    }

    public String getTipoAcuerdo() {
        return tipoAcuerdo;
    }

    public static boolean acuerdoValido(String tipoAcuerdo){
        for (TiposAcuerdo s: TiposAcuerdo.values()){
            if(s.getTipoAcuerdo().equals(tipoAcuerdo)){
                return  true;
            }
        }
        return false;
    }
}
