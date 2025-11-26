package com.crmpps.Backend.exception;


import com.crmpps.Backend.dto.ErrorDTO;
import io.swagger.v3.oas.annotations.Hidden;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.NoSuchElementException;

@RestControllerAdvice
@Hidden
public class ControllerAdvice {
    @ExceptionHandler(MissingServletRequestParameterException.class)
    @Hidden
    public ResponseEntity<ErrorDTO> handleMissingParams(MissingServletRequestParameterException ex) {
        ErrorDTO error = ErrorDTO.builder().codigo("400").mensaje("Falta el siguiente parametro: " + ex.getParameterName()).build();
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    @Hidden
    public ResponseEntity<ErrorDTO> handleGeneric(Exception ex) {
        ErrorDTO error = ErrorDTO.builder().codigo("500").mensaje("Error interno: " + ex.getMessage()).build();
        return new ResponseEntity<>(error,HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(NoSuchElementException.class)
    @Hidden
    public ResponseEntity<ErrorDTO> errorNotFound(Exception ex) {
        ErrorDTO error = ErrorDTO.builder().codigo("404").mensaje(ex.getMessage()).build();
        return new ResponseEntity<>(error,HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(BadCredentialsException.class)
    @Hidden
    public ResponseEntity<ErrorDTO> badCredentials(Exception ex) {
        ErrorDTO error = ErrorDTO.builder().codigo("401").mensaje("Usuario o contraseña invalidos.").build();
        return new ResponseEntity<>(error,HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(NoAutorizadoException.class)
    @Hidden
    public ResponseEntity<ErrorDTO> noAutorizado(Exception ex) {
        ErrorDTO error = ErrorDTO.builder().codigo("403").mensaje(ex.getMessage()).build();
        return new ResponseEntity<>(error,HttpStatus.FORBIDDEN);
    }
}
