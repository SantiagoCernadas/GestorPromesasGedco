package com.crmpps.Backend.service;

import com.crmpps.Backend.dto.UsuarioResponse;
import com.crmpps.Backend.entity.Rol;
import com.crmpps.Backend.entity.UsuarioEntity;
import com.crmpps.Backend.repository.UsuarioRepository;
import com.crmpps.Backend.util.JwtUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@SpringBootTest(
        properties = {
                "spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration"
                ,"spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration"
        }
)
class UsuarioServiceTest {

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private UsuarioService usuarioService;

    private UsuarioEntity usuarioEntity;

    private Map<String,String> headers;

    private UsuarioResponse usuario;

    private List<UsuarioEntity> usuarios;

    @BeforeEach
    void setUp(){
        MockitoAnnotations.openMocks(this);

        headers = new HashMap<>();
        headers.put("authorization","Bearer testToken");

        usuarioEntity = UsuarioEntity
                .builder()
                .id(1L)
                .nombreUsuario("Usuario_test")
                .nombre("Nombre_test")
                .rol(Rol.OPERADOR)
                .contrasenia("test")
                .build();

        usuario = UsuarioResponse.builder()
                .id(usuarioEntity.getId())
                .nombreUsuario(usuarioEntity.getNombreUsuario())
                .rol(usuarioEntity.getRol())
                .nombre(usuarioEntity.getNombre())
                .build();

        usuarios = new ArrayList<>();
        usuarios.add(usuarioEntity);
    }

    @Test
    void getUsuario_OK() {

        when(jwtUtils.getNombreUsuarioFromToken(any(String.class)))
                .thenReturn("Test");

        when(usuarioRepository.findByNombreUsuario(any(String.class)))
                .thenReturn(Optional.of(usuarioEntity));

        assertDoesNotThrow(() -> {
            usuarioService.getDatosUsuario(headers);
        });
    }

    @Test
    void getUsuario_UsuarioInexistente_Excepcion() {

        when(jwtUtils.getNombreUsuarioFromToken(any(String.class)))
                .thenReturn("Test");

        when(usuarioRepository.findByNombreUsuario("UsuarioInexistenteTest"))
                .thenThrow(NoSuchElementException.class);

        assertThrows(NoSuchElementException.class , () -> {
            usuarioService.getDatosUsuario(headers);
        });
    }

    @Test
    void getOperadores_rolOperador_OK() {
        when(jwtUtils.getRolFromToken(any(String.class)))
                .thenReturn("ROLE_OPERADOR");

        when(jwtUtils.getNombreUsuarioFromToken(any(String.class)))
                .thenReturn("Test");

        when(usuarioRepository.getNombreUsuario(any(String.class)))
                .thenReturn(Optional.of(usuarioEntity));

        assertDoesNotThrow(() ->{
            usuarioService.getOperadores(headers);
        });
    }

    @Test
    void getOperadores_RolSupervisor_OK() {
        when(jwtUtils.getRolFromToken(any(String.class)))
                .thenReturn("ROLE_SUPERVISOR");

        when(usuarioRepository.getNombreUsuario(any(String.class)))
                .thenReturn(Optional.of(usuarioEntity));

        when(usuarioRepository.getOperadores())
                .thenReturn(usuarios);

        assertDoesNotThrow(() ->{
            usuarioService.getOperadores(headers);
        });
    }
}