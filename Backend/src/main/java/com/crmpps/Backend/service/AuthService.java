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

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;


    public LoginResponse getToken(LoginRequest loginRequest){

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getNombreUsuario(),
                        loginRequest.getContrasenia())
        );

        UserDetails user = (UserDetails) authentication.getPrincipal();
        String token = jwtUtils.generarToken(user);
        return new LoginResponse(token);
    }
}
