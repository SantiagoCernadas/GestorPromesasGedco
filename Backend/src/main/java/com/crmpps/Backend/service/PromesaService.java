package com.crmpps.Backend.service;

import com.crmpps.Backend.dto.PromesaDTO;
import com.crmpps.Backend.entity.PromesaEntity;
import com.crmpps.Backend.entity.UsuarioEntity;
import com.crmpps.Backend.repository.PromesaRepository;
import com.crmpps.Backend.repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PromesaService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PromesaRepository promesaRepository;

    public PromesaEntity agregarUsuario(@Valid PromesaDTO promesaDTO) {

        UsuarioEntity usuarioEntity = usuarioRepository.findById(promesaDTO.getOperador())
                .orElseThrow();

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
}
