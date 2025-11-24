package com.crmpps.Backend.service;

import com.crmpps.Backend.dto.PromesaDTO;
import com.crmpps.Backend.dto.PromesaResponse;
import com.crmpps.Backend.entity.PromesaEntity;
import com.crmpps.Backend.entity.UsuarioEntity;
import com.crmpps.Backend.exception.NoAutorizadoException;
import com.crmpps.Backend.repository.PromesaCustomRepository;
import com.crmpps.Backend.repository.PromesaRepository;
import com.crmpps.Backend.repository.UsuarioRepository;
import com.crmpps.Backend.util.JwtUtils;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class PromesaService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PromesaCustomRepository promesaCustomRepository;

    @Autowired
    private PromesaRepository promesaRepository;

    @Autowired
    private JwtUtils jwtUtils;

    public PromesaEntity agregarPromesa(Map<String, String> headers, @Valid PromesaDTO promesaDTO) throws NoAutorizadoException {
        String tokenHeader = headers.get("authorization");
        UsuarioEntity usuarioEntity = usuarioRepository.findById(promesaDTO.getOperador())
                .orElseThrow(() -> new NoSuchElementException("No se encontro al usuario con id: " + promesaDTO.getOperador()));

        if (getRolToken(tokenHeader).equals(("ROLE_OPERADOR")) &&
                !usuarioEntity.getNombreUsuario().equals(getNombreUsuarioToken(tokenHeader))){
            throw new NoAutorizadoException("Credenciales invalidas.");
        }

        PromesaEntity promesaEntity = PromesaEntity.builder()
                .idUsuarioML(promesaDTO.getIdUsuarioML())
                .numCaso(promesaDTO.getNumCaso())
                .monto(promesaDTO.getMonto())
                .site(promesaDTO.getSite())
                .canal(promesaDTO.getCanal())
                .tipoAcuerdo(promesaDTO.getTipoAcuerdo())
                .cumplimiento(promesaDTO.getCumplimiento())
                .fechaCarga(promesaDTO.getFechaCarga())
                .fechaPago(promesaDTO.getFechaPago())
                .operador(usuarioEntity)
                .build();

        promesaRepository.save(promesaEntity);

        return promesaEntity;
    }

    public List<PromesaResponse> getPromesasOperadorFiltros(Map<String, String> headers,
                                                            Integer caso,
                                                            Integer usuarioML,
                                                            String canal,
                                                            String site,
                                                            String tipoAcuerdo,
                                                            String tipoCumplimiento,
                                                            LocalDate fechaCargaDesde,
                                                            LocalDate fechaCargaHasta,
                                                            Long operador,
                                                            Boolean duplica) throws NoAutorizadoException {


        String tokenHeader = headers.get("authorization");
        if (operador == null){
            if (getRolToken(tokenHeader).equals(("ROLE_OPERADOR"))){
                throw new NoAutorizadoException("Credenciales invalidas.");
            }
        }
        else {
            UsuarioEntity usuarioEntity = usuarioRepository.findById(operador)
                    .orElseThrow(() -> new NoSuchElementException("No se encontro al usuario con id: " + operador));

            if(getRolToken(tokenHeader).equals(("ROLE_OPERADOR")) &&
                    !usuarioEntity.getNombreUsuario().equals(getNombreUsuarioToken(tokenHeader))){
                throw new NoAutorizadoException("Credenciales invalidas.");
            }
        }


        List<PromesaEntity> listaPromesas= promesaCustomRepository.filtrar(caso, usuarioML, canal, site,
                tipoAcuerdo, tipoCumplimiento, fechaCargaDesde, fechaCargaHasta, operador, duplica);

        List<PromesaResponse> listaResponse = new ArrayList<>();

        for(PromesaEntity promesa: listaPromesas){
            PromesaResponse response = PromesaResponse.builder()
                    .id(promesa.getId())
                    .idUsuarioML(promesa.getIdUsuarioML())
                    .numCaso(promesa.getNumCaso())
                    .monto(promesa.getMonto())
                    .site(promesa.getSite())
                    .canal(promesa.getCanal())
                    .tipoAcuerdo(promesa.getTipoAcuerdo())
                    .cumplimiento(promesa.getCumplimiento())
                    .fechaCarga(promesa.getFechaCarga())
                    .fechaPago(promesa.getFechaPago())
                    .operador(promesa.getOperador().getNombre())
                    .build();

            listaResponse.add(response);
        }

        return listaResponse;
    }

    public PromesaResponse obtenerPromesa(Map<String, String> headers, Long id) throws NoAutorizadoException {
        PromesaEntity promesa = promesaRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("No se encontro la promesa con id:" + id));


        String tokenHeader = headers.get("authorization");

        if (getRolToken(tokenHeader).equals(("ROLE_OPERADOR")) &&
                !promesa.getOperador().getNombreUsuario().equals(getNombreUsuarioToken(tokenHeader))){
            throw new NoAutorizadoException("Credenciales invalidas.");
        }

        PromesaResponse response = PromesaResponse.builder()
                .id(promesa.getId())
                .idUsuarioML(promesa.getIdUsuarioML())
                .numCaso(promesa.getNumCaso())
                .monto(promesa.getMonto())
                .site(promesa.getSite())
                .canal(promesa.getCanal())
                .tipoAcuerdo(promesa.getTipoAcuerdo())
                .cumplimiento(promesa.getCumplimiento())
                .fechaCarga(promesa.getFechaCarga())
                .fechaPago(promesa.getFechaPago())
                .operador(promesa.getOperador().getNombre())
                .build();

        return response;
    }

    public String getRolToken(String token) {
        return jwtUtils.getRolFromToken(token.substring(7));
    }

    public String getNombreUsuarioToken(String token){
        return jwtUtils.getNombreUsuarioFromToken(token.substring(7));
    }
}
