package com.crmpps.Backend.controller;


import com.crmpps.Backend.dto.LoginRequest;
import com.crmpps.Backend.dto.LoginResponse;
import com.crmpps.Backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestHeader Map<String,String> headers,@RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.getToken(headers,loginRequest));
    }
}
