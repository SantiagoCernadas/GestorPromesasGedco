package com.crmpps.Backend.controller;

import com.crmpps.Backend.dto.UsuarioDTO;
import com.crmpps.Backend.entity.UsuarioEntity;
import com.crmpps.Backend.repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
public class PruebaController {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping("/hello")
    public String hello(){
        return "Hola prueba";
    }

    @GetMapping("/helloSeguro")
    public String helloSeguro(){
        return "Hola prueba con seguridad";
    }
    @GetMapping("/helloSeguroSupervisor")
    public String helloSeguroSuper(){
        return "Hola prueba con seguridad";
    }


    @PostMapping("/crearUsuario")
    public ResponseEntity<?> crearUsuario(@Valid @RequestBody UsuarioDTO usuarioDTO){
        System.out.println(usuarioDTO);
        UsuarioEntity usuario = UsuarioEntity.builder()
                .nombreUsuario(usuarioDTO.getNombreUsuario())
                .contrasenia(passwordEncoder.encode(usuarioDTO.getContrasenia()))
                .rol(usuarioDTO.getRol())
                .nombre(usuarioDTO.getNombre())
                .build();

        usuarioRepository.save(usuario);

        return ResponseEntity.ok(usuario);
    }

    @DeleteMapping("/deleteUser")
    public String eliminarUsuario(@RequestParam String id){
        usuarioRepository.deleteById(Long.parseLong(id));
        return "Se borro el user con id: " + id;
    }
}
