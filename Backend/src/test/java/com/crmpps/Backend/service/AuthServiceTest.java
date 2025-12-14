package com.crmpps.Backend.service;

import com.crmpps.Backend.dto.LoginRequest;
import com.crmpps.Backend.util.JwtUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtUtils jwtUtils;

    @InjectMocks
    private AuthService authService;

    private Map<String,String> headers;
    private LoginRequest loginRequest;

    Authentication authentication = mock(Authentication.class);

    @BeforeEach
    void setUp(){
        MockitoAnnotations.openMocks(this);
        headers = new HashMap<>();
    }

    @Test
    void getToken_Ok() {
        loginRequest = LoginRequest
                .builder()
                .nombreUsuario("test")
                .contrasenia("test")
                .build();

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);

        when(jwtUtils.generarToken(any(UserDetails.class))).
                thenReturn("Test");

        assertDoesNotThrow(() ->{
            authService.getToken(headers,loginRequest);
        });
    }

    @Test
    void getToken_CredencialesIncorrectas() {

        loginRequest = LoginRequest
                .builder()
                .nombreUsuario("NombreUsuarioIncorrecto")
                .contrasenia("ContraseniaIncorrecta")
                .build();

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(BadCredentialsException.class);

        when(jwtUtils.generarToken(any(UserDetails.class))).
                thenReturn("Test");

        assertThrows(BadCredentialsException.class,() ->{
            authService.getToken(headers,loginRequest);
        });
    }
}