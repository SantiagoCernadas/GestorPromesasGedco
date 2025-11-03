package com.crmpps.Backend.service;


import com.crmpps.Backend.dto.UsuarioResponse;
import com.crmpps.Backend.entity.UsuarioEntity;
import com.crmpps.Backend.repository.UsuarioRepository;
import com.crmpps.Backend.util.JwtUtils;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {
    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public UsuarioResponse getUsuario(String token){
        String nombreUsuario = jwtUtils.getNombreUsuarioFromToken(token);

        UsuarioEntity usuarioEntity = usuarioRepository.findByNombreUsuario(nombreUsuario).orElseThrow();

        return UsuarioResponse.builder()
                .nombreUsuario(usuarioEntity.getNombreUsuario())
                .rol(usuarioEntity.getRol())
                .nombre(usuarioEntity.getNombre())
                .build();
    }
}
