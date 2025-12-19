package com.crmpps.Backend.service;


import com.crmpps.Backend.dto.ModificarUsuarioRequest;
import com.crmpps.Backend.dto.UsuarioRequest;
import com.crmpps.Backend.dto.UsuarioResponse;
import com.crmpps.Backend.entity.UsuarioEntity;
import com.crmpps.Backend.exception.LogicaInvalidaException;
import com.crmpps.Backend.exception.NoAutorizadoException;
import com.crmpps.Backend.repository.UsuarioRepository;
import com.crmpps.Backend.util.JwtUtils;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

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

    public UsuarioResponse agregarUsuario(Map<String, String> headers, UsuarioRequest usuarioRequest) throws LogicaInvalidaException, NoAutorizadoException {

        String tokenHeader = headers.get("authorization").substring(7);
        if (!jwtUtils.getRolFromToken(tokenHeader).equals(("ROLE_ADMIN"))){
            throw new NoAutorizadoException("Credenciales invalidas.");
        }

        if (usuarioRepository.findByNombreUsuario(usuarioRequest.getNombreUsuario()).isPresent()){
            throw new LogicaInvalidaException("Ya existe un usuario con nombre de usuario: " + usuarioRequest.getNombreUsuario());
        }

        if (usuarioRequest.getRol().name().equals("ADMIN")){
            throw  new LogicaInvalidaException("No es posible agregar a un nuevo usuario con rol ADMIN");
        }

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        UsuarioEntity usuarioEntity = UsuarioEntity.builder()
                .nombreUsuario(usuarioRequest.getNombreUsuario())
                .contrasenia(encoder.encode(usuarioRequest.getContrasenia()))
                .nombre(usuarioRequest.getNombre())
                .rol(usuarioRequest.getRol())
                .build();

        usuarioRepository.save(usuarioEntity);

        return UsuarioResponse
                .builder()
                .id(usuarioEntity.getId())
                .nombreUsuario(usuarioEntity.getNombreUsuario())
                .nombre(usuarioEntity.getNombre())
                .rol(usuarioEntity.getRol())
                .build();
    }

    public void eliminarUsuario(Map<String, String> headers, Long id) throws NoAutorizadoException, LogicaInvalidaException {
        String tokenHeader = headers.get("authorization").substring(7);
        if (!jwtUtils.getRolFromToken(tokenHeader).equals(("ROLE_ADMIN"))){
            throw new NoAutorizadoException("Credenciales invalidas.");
        }

        UsuarioEntity usuarioEntity = usuarioRepository.findById(id).orElseThrow(() ->
                new NoSuchElementException("No existe el usuario con id: " + id));

        if (usuarioEntity.getRol().name().equals("ADMIN")){
            throw  new LogicaInvalidaException("No es eliminar a un usuario con rol ADMIN");
        }

        usuarioRepository.deleteById(id);
    }

    public UsuarioResponse modificarUsuario(Map<String, String> headers, Long id, ModificarUsuarioRequest request) throws NoAutorizadoException, LogicaInvalidaException {
        String tokenHeader = headers.get("authorization").substring(7);
        if (!jwtUtils.getRolFromToken(tokenHeader).equals(("ROLE_ADMIN"))){
            throw new NoAutorizadoException("Credenciales invalidas.");
        }



        UsuarioEntity usuarioEntity = usuarioRepository.findById(id).orElseThrow(() ->
                new NoSuchElementException("No existe el usuario con id: " + id));

        Optional<UsuarioEntity> usuario = usuarioRepository.findByNombreUsuario(request.getNombreUsuario());

        if (usuario.isPresent() && (usuario.get().getId() != usuarioEntity.getId())){
            throw new LogicaInvalidaException("Existe otro usuario con el nombre de usuario: " + request.getNombreUsuario());
        }

        if (request.getRol().name().equals("ADMIN")){
            throw  new LogicaInvalidaException("No es posible darle el rol de ADMIN a otro usuario.");
        }

        if (usuarioEntity.getRol().name().equals("ADMIN")){
            throw  new LogicaInvalidaException("No es posible modificar los datos de un usuario ADMIN");
        }

        usuarioEntity.setNombreUsuario(request.getNombreUsuario());
        usuarioEntity.setNombre(request.getNombre());
        usuarioEntity.setRol(request.getRol());

        usuarioRepository.save(usuarioEntity);

        return UsuarioResponse
                .builder()
                .id(usuarioEntity.getId())
                .nombreUsuario(usuarioEntity.getNombreUsuario())
                .nombre(usuarioEntity.getNombre())
                .rol(usuarioEntity.getRol())
                .build();
    }
}
