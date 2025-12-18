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

    public UsuarioResponse getDatosUsuario(Map<String,String> headers){
        String token = headers.get("authorization").substring(7);
        String nombreUsuario = jwtUtils.getNombreUsuarioFromToken(token);

        UsuarioEntity usuarioEntity = usuarioRepository.findByNombreUsuario(nombreUsuario)
                .orElseThrow(() -> new NoSuchElementException("No se encontro un usuario con en nick: " + nombreUsuario));

        return UsuarioResponse.builder()
                .id(usuarioEntity.getId())
                .nombreUsuario(usuarioEntity.getNombreUsuario())
                .rol(usuarioEntity.getRol())
                .nombre(usuarioEntity.getNombre())
                .build();
    }

    public List<UsuarioResponse> getOperadores(Map<String,String> headers) {

        List<UsuarioResponse> response = new ArrayList<>();
        String tokenHeader = headers.get("authorization").substring(7);

        if (jwtUtils.getRolFromToken(tokenHeader).equals(("ROLE_OPERADOR"))){
            UsuarioEntity usuarioEntity = usuarioRepository.getNombreUsuario(jwtUtils.getNombreUsuarioFromToken(tokenHeader))
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

    public List<UsuarioResponse> getUsuarios(Map<String, String> headers, String nombre) throws NoAutorizadoException {
        String tokenHeader = headers.get("authorization").substring(7);
        if (!jwtUtils.getRolFromToken(tokenHeader).equals(("ROLE_ADMIN"))){
            throw new NoAutorizadoException("Credenciales invalidas.");
        }

        List<UsuarioResponse> response = new ArrayList<>();

        if (nombre == null){
            nombre = "";
        }
        List<UsuarioEntity> listaUsuarios = usuarioRepository.getUsuarios(nombre);

        for(UsuarioEntity usuarioEntity : listaUsuarios){
            UsuarioResponse usuario = UsuarioResponse.builder()
                    .id(usuarioEntity.getId())
                    .nombreUsuario(usuarioEntity.getNombreUsuario())
                    .rol(usuarioEntity.getRol())
                    .nombre(usuarioEntity.getNombre())
                    .build();
            response.add(usuario);
        }

        return response;
    }
}
