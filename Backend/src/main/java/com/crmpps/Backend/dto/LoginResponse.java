package com.crmpps.Backend.dto;

import lombok.Data;

@Data
public class LoginResponse {
    private String token;
    public LoginResponse(String token) {
        this.token = token;
    }
}
