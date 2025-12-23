package com.crmpps.Backend.dto.enums;

public enum Canales {
    OFFLINE("OFFLINE"),
    CHAT("CHAT"),
    C2C("C2C");

    private final String canal;

    Canales(String canal) {
        this.canal = canal;
    }

    public String getCanal() {
        return canal;
    }

    public static boolean canalValido(String canal){
        for (Canales s: Canales.values()){
            if(s.getCanal().equals(canal)){
                return  true;
            }
        }
        return false;
    }
}
