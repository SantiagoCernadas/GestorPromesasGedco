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
}
