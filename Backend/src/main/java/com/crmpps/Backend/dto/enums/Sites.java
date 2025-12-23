package com.crmpps.Backend.dto.enums;

public enum Sites {
    MLA("MLA"),
    MLM("MLM"),
    MLC("MLC");

    private final String site;

    Sites(String site) {
        this.site = site;
    }

    public String getSite() {
        return site;
    }

    public static boolean siteValido(String site){
        for (Sites s: Sites.values()){
            if(s.getSite().equals(site)){
                return  true;
            }
        }
        return false;
    }
}
