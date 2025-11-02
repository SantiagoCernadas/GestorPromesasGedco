package com.crmpps.Backend.service;

import com.crmpps.Backend.dto.PromesaDTO;
import com.crmpps.Backend.dto.PromesaResponse;
import com.crmpps.Backend.entity.PromesaEntity;
import com.crmpps.Backend.entity.UsuarioEntity;
import com.crmpps.Backend.repository.PromesaCustomRepository;
import com.crmpps.Backend.repository.PromesaRepository;
import com.crmpps.Backend.repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PromesaService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PromesaCustomRepository promesaCustomRepository;

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

    public List<PromesaResponse> getPromesasOperadorFiltros(Integer caso,
                                                      Integer usuarioML,
                                                      String canal,
                                                      String site,
                                                      String tipoAcuerdo,
                                                      String tipoCumplimiento,
                                                      LocalDate fechaCargaDesde,
                                                            LocalDate fechaCargaHasta,
                                                      Integer operador,
                                                      Boolean duplica) {


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
}
