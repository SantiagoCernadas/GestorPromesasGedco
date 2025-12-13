package com.crmpps.Backend.service;

import com.crmpps.Backend.dto.PromesaRequest;
import com.crmpps.Backend.dto.enums.Canales;
import com.crmpps.Backend.dto.enums.EstadosCumplimiento;
import com.crmpps.Backend.dto.enums.Sites;
import com.crmpps.Backend.dto.enums.TiposAcuerdo;
import com.crmpps.Backend.entity.Rol;
import com.crmpps.Backend.entity.UsuarioEntity;
import com.crmpps.Backend.exception.LogicaInvalidaException;
import com.crmpps.Backend.exception.NoAutorizadoException;
import com.crmpps.Backend.repository.PromesaCustomRepository;
import com.crmpps.Backend.repository.PromesaRepository;
import com.crmpps.Backend.repository.UsuarioRepository;
import com.crmpps.Backend.util.JwtUtils;
import org.hibernate.mapping.Any;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class PromesaServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PromesaCustomRepository promesaCustomRepository;

    @Mock
    private PromesaRepository promesaRepository;

    @Mock
    private JwtUtils jwtUtils;

    @InjectMocks
    private PromesaService promesaService;

    private PromesaRequest promesaRequest;
    private UsuarioEntity usuarioEntity;
    private Map<String,String> headers;

    @BeforeEach
    void setUp(){
        MockitoAnnotations.openMocks(this);
        promesaRequest = PromesaRequest
                .builder()
                .idUsuarioML(2314L)
                .numCaso(3425L)
                .monto(200.20)
                .site(Sites.MLA.getSite())
                .canal(Canales.CHAT.getCanal())
                .tipoAcuerdo(TiposAcuerdo.PAGO_PARCIAL.getTipoAcuerdo())
                .cumplimiento(EstadosCumplimiento.EN_CURSO.getEstado())
                .fechaCarga(LocalDate.now())
                .fechaPago(LocalDate.now())
                .operador(1L)
                .build();

        usuarioEntity = UsuarioEntity
                .builder()
                .id(1L)
                .nombreUsuario("Usuario_prueba")
                .nombre("Nombre_prueba")
                .rol(Rol.OPERADOR)
                .contrasenia("prueba")
                .build();

        headers = new HashMap<>();
        headers.put("authorization","Bearer pruebadetoken");
    }
    @Test
    void agregarPromesa_rolOperador_Ok() {
        when(usuarioRepository.findById(any(Long.class)))
                .thenReturn(Optional.of(usuarioEntity));

        when(jwtUtils.getRolFromToken(any(String.class)))
                .thenReturn("ROLE_OPERADOR");

        when(jwtUtils.getNombreUsuarioFromToken(any(String.class)))
                .thenReturn(usuarioEntity.getNombreUsuario());

        assertDoesNotThrow( () -> {
            promesaService.agregarPromesa(headers,promesaRequest);
        });
    }

    @Test
    void agregarPromesa_rolOperador_credencialesInvalidas() {
        when(usuarioRepository.findById(any(Long.class)))
                .thenReturn(Optional.of(usuarioEntity));

        when(jwtUtils.getRolFromToken(any(String.class)))
                .thenReturn("ROLE_OPERADOR");

        when(jwtUtils.getNombreUsuarioFromToken(any(String.class)))
                .thenReturn(usuarioEntity.getNombreUsuario()+"diferencia");

        assertThrows(NoAutorizadoException.class ,() -> {
            promesaService.agregarPromesa(headers,promesaRequest);
        });
    }

    @Test
    void agregarPromesa_rolSupervisor_Ok() {
        when(usuarioRepository.findById(any(Long.class)))
                .thenReturn(Optional.of(usuarioEntity));

        when(jwtUtils.getRolFromToken(any(String.class)))
                .thenReturn("ROLE_SUPERVISOR");

        when(jwtUtils.getNombreUsuarioFromToken(any(String.class)))
                .thenReturn(usuarioEntity.getNombreUsuario()+"diferencia");

        assertDoesNotThrow(() -> {
            promesaService.agregarPromesa(headers,promesaRequest);
        });
    }

    @Test
    void agregarPromesa_numCasoInvalido_logicaInvalida() {
        promesaRequest.setNumCaso(-1L);

        when(usuarioRepository.findById(any(Long.class)))
                .thenReturn(Optional.of(usuarioEntity));

        when(jwtUtils.getRolFromToken(any(String.class)))
                .thenReturn("ROLE_OPERADOR");

        when(jwtUtils.getNombreUsuarioFromToken(any(String.class)))
                .thenReturn(usuarioEntity.getNombreUsuario());

        assertThrows(LogicaInvalidaException.class ,() -> {
            promesaService.agregarPromesa(headers,promesaRequest);
        });
    }

    @Test
    void agregarPromesa_FechaCargaSuperiorAFechaPago_logicaInvalida() {
        promesaRequest.setFechaCarga(LocalDate.of(2025,12,13));
        promesaRequest.setFechaPago(LocalDate.of(2025,12,12));

        when(usuarioRepository.findById(any(Long.class)))
                .thenReturn(Optional.of(usuarioEntity));

        when(jwtUtils.getRolFromToken(any(String.class)))
                .thenReturn("ROLE_OPERADOR");

        when(jwtUtils.getNombreUsuarioFromToken(any(String.class)))
                .thenReturn(usuarioEntity.getNombreUsuario());

        assertThrows(LogicaInvalidaException.class ,() -> {
            promesaService.agregarPromesa(headers,promesaRequest);
        });
    }


    @Test
    void getPromesasOperadorFiltros_RolOperador_Ok() {
        when(usuarioRepository.findById(any(Long.class)))
                .thenReturn(Optional.of(usuarioEntity));

        when(jwtUtils.getRolFromToken(any(String.class)))
                .thenReturn("ROLE_OPERADOR");

        when(jwtUtils.getNombreUsuarioFromToken(any(String.class)))
                .thenReturn(usuarioEntity.getNombreUsuario());

        assertDoesNotThrow(() -> {
            promesaService.getPromesasOperadorFiltros(
                    headers,
                    1,
                    1,
                    "MLA",
                    "Pago total",
                    "Parcelamento",
                    "Cumplida",
                    LocalDate.now(),
                    LocalDate.now(),
                    1L,
                    false
            );
        });
    }

    @Test
    void getPromesasOperadorFiltros_RolOperadorFiltrarTodosOperadores_credencialesInvalidas() {
        when(usuarioRepository.findById(any(Long.class)))
                .thenReturn(Optional.of(usuarioEntity));

        when(jwtUtils.getRolFromToken(any(String.class)))
                .thenReturn("ROLE_OPERADOR");

        when(jwtUtils.getNombreUsuarioFromToken(any(String.class)))
                .thenReturn(usuarioEntity.getNombreUsuario());

        assertThrows(NoAutorizadoException.class,() -> {
            promesaService.getPromesasOperadorFiltros(
                    headers,
                    1,
                    1,
                    "MLA",
                    "Pago total",
                    "Parcelamento",
                    "Cumplida",
                    LocalDate.now(),
                    LocalDate.now(),
                    null,
                    false
            );
        });
    }

    @Test
    void obtenerPromesa() {
    }

    @Test
    void eliminarPromesa() {
    }

    @Test
    void modificarPromesa() {
    }

    @Test
    void getEstadisticas() {
    }

    @Test
    void promesaDuplica() {
    }

    @Test
    void getExcelTabla() {
    }
}