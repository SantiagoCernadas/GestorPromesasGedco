package com.crmpps.Backend.service;

import com.crmpps.Backend.dto.LoginRequest;
import com.crmpps.Backend.dto.LoginResponse;
import com.crmpps.Backend.util.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;


    public LoginResponse getToken(Map<String, String> headers, LoginRequest loginRequest){

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getNombreUsuario(),
                        loginRequest.getContrasenia())
        );

        String token = jwtUtils.generarToken((UserDetails) authentication.getPrincipal());
        return new LoginResponse(token);
    }
}
