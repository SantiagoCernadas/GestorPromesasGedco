package com.crmpps.Backend.service;


import com.crmpps.Backend.dto.UsuarioResponse;
import com.crmpps.Backend.entity.UsuarioEntity;
import com.crmpps.Backend.exception.NoAutorizadoException;
import com.crmpps.Backend.repository.UsuarioRepository;
import com.crmpps.Backend.util.JwtUtils;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@Service
public class UsuarioService {
    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public UsuarioResponse getUsuario(Map<String,String> headers){
        String token = headers.get("authorization").substring(7);
        String nombreUsuario = jwtUtils.getNombreUsuarioFromToken(token);

        UsuarioEntity usuarioEntity = usuarioRepository.findByNombreUsuario(nombreUsuario).orElseThrow();

        return UsuarioResponse.builder()
                .id(usuarioEntity.getId())
                .nombreUsuario(usuarioEntity.getNombreUsuario())
                .rol(usuarioEntity.getRol())
                .nombre(usuarioEntity.getNombre())
                .build();
    }

    public List<UsuarioResponse> getOperadores(Map<String,String> headers) {

        List<UsuarioResponse> response = new ArrayList<>();
        String tokenHeader = headers.get("authorization");

        if (getRolToken(tokenHeader).equals(("ROLE_OPERADOR"))){
            UsuarioEntity usuarioEntity = usuarioRepository.getNombreUsuario(getNombreUsuarioToken(tokenHeader))
                    .orElseThrow(() -> new NoSuchElementException("Usuario inexistente."));

            UsuarioResponse usuario = UsuarioResponse.builder()
                    .id(usuarioEntity.getId())
                    .nombreUsuario(usuarioEntity.getNombreUsuario())
                    .rol(usuarioEntity.getRol())
                    .nombre(usuarioEntity.getNombre())
                    .build();
            response.add(usuario);
        }
        else {
            List<UsuarioEntity> operadores = usuarioRepository.getOperadores();
            for(UsuarioEntity operador : operadores){
                UsuarioResponse usuario = UsuarioResponse.builder()
                        .id(operador.getId())
                        .nombreUsuario(operador.getNombreUsuario())
                        .rol(operador.getRol())
                        .nombre(operador.getNombre())
                        .build();
                response.add(usuario);
            }
        }
        return  response;
    }

    public String getRolToken(String token) {
        return jwtUtils.getRolFromToken(token.substring(7));
    }

    public String getNombreUsuarioToken(String token){
        return jwtUtils.getNombreUsuarioFromToken(token.substring(7));
    }
}
