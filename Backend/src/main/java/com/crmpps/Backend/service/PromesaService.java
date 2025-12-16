package com.crmpps.Backend.service;

import com.crmpps.Backend.dto.EstadisticaResponse;
import com.crmpps.Backend.dto.PromesaExcelRequest;
import com.crmpps.Backend.dto.PromesaRequest;
import com.crmpps.Backend.dto.PromesaResponse;
import com.crmpps.Backend.dto.enums.Canales;
import com.crmpps.Backend.dto.enums.EstadosCumplimiento;
import com.crmpps.Backend.dto.enums.Sites;
import com.crmpps.Backend.dto.enums.TiposAcuerdo;
import com.crmpps.Backend.entity.PromesaEntity;
import com.crmpps.Backend.entity.UsuarioEntity;
import com.crmpps.Backend.exception.LogicaInvalidaException;
import com.crmpps.Backend.exception.NoAutorizadoException;
import com.crmpps.Backend.repository.PromesaCustomRepository;
import com.crmpps.Backend.repository.PromesaRepository;
import com.crmpps.Backend.repository.UsuarioRepository;
import com.crmpps.Backend.util.JwtUtils;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

import static com.crmpps.Backend.dto.enums.Sites.*;

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

    public PromesaResponse agregarPromesa(Map<String, String> headers, @Valid PromesaRequest promesaRequest) throws NoAutorizadoException, LogicaInvalidaException {
        String tokenHeader = headers.get("authorization").substring(7);
        UsuarioEntity usuarioEntity = usuarioRepository.findById(promesaRequest.getOperador())
                .orElseThrow(() -> new NoSuchElementException("No se encontro al usuario con id: " + promesaRequest.getOperador()));

        if (jwtUtils.getRolFromToken(tokenHeader).equals(("ROLE_OPERADOR")) &&
                !usuarioEntity.getNombreUsuario().equals(jwtUtils.getNombreUsuarioFromToken(tokenHeader))){
            throw new NoAutorizadoException("Credenciales invalidas.");
        }

        validarPromesa(promesaRequest);

        PromesaEntity promesaEntity = PromesaEntity.builder()
                .idUsuarioML(promesaRequest.getIdUsuarioML())
                .numCaso(promesaRequest.getNumCaso())
                .monto(promesaRequest.getMonto())
                .site(promesaRequest.getSite())
                .canal(promesaRequest.getCanal())
                .tipoAcuerdo(promesaRequest.getTipoAcuerdo())
                .cumplimiento(promesaRequest.getCumplimiento())
                .fechaCarga(promesaRequest.getFechaCarga())
                .fechaPago(promesaRequest.getFechaPago())
                .operador(usuarioEntity)
                .build();

        promesaRepository.save(promesaEntity);

        return PromesaResponse.builder()
                .id(promesaEntity.getId())
                .idUsuarioML(promesaEntity.getIdUsuarioML())
                .numCaso(promesaEntity.getNumCaso())
                .monto(promesaEntity.getMonto())
                .site(promesaEntity.getSite())
                .canal(promesaEntity.getCanal())
                .tipoAcuerdo(promesaEntity.getTipoAcuerdo())
                .cumplimiento(promesaEntity.getCumplimiento())
                .fechaCarga(promesaEntity.getFechaCarga())
                .fechaPago(promesaEntity.getFechaPago())
                .operador(promesaEntity.getOperador().getNombre())
                .build();
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


        String tokenHeader = headers.get("authorization").substring(7);
        if (operador == null){
            if (jwtUtils.getRolFromToken(tokenHeader).equals(("ROLE_OPERADOR"))){
                //operador = usuarioRepository.findByNombreUsuario(getNombreUsuarioToken(tokenHeader)).orElseThrow().getId();
                throw new NoAutorizadoException("Credenciales invalidas.");
            }
        }
        else {
            UsuarioEntity usuarioEntity = usuarioRepository.findById(operador)
                    .orElseThrow(() -> new NoSuchElementException("No se encontro al usuario con id: " + operador));


            if (jwtUtils.getRolFromToken(tokenHeader).equals(("ROLE_OPERADOR")) &&
                    !usuarioEntity.getNombreUsuario().equals(jwtUtils.getNombreUsuarioFromToken(tokenHeader))){
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


        String tokenHeader = headers.get("authorization").substring(7);

        if (jwtUtils.getRolFromToken(tokenHeader).equals(("ROLE_OPERADOR")) &&
                !promesa.getOperador().getNombreUsuario().equals(jwtUtils.getNombreUsuarioFromToken(tokenHeader))){
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

    public void eliminarPromesa(Map<String, String> headers, Long id) throws NoAutorizadoException {
        PromesaEntity promesa = promesaRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("No se encontro la promesa con id:" + id));

        String tokenHeader = headers.get("authorization").substring(7);

        if (jwtUtils.getRolFromToken(tokenHeader).equals(("ROLE_OPERADOR")) &&
                !promesa.getOperador().getNombreUsuario().equals(jwtUtils.getNombreUsuarioFromToken(tokenHeader))){
            throw new NoAutorizadoException("Credenciales invalidas.");
        }

        promesaRepository.deleteById(id);
    }


    public PromesaResponse modificarPromesa(Map<String, String> headers, Long id, PromesaRequest promesaRequest) throws NoAutorizadoException, LogicaInvalidaException {

        String tokenHeader = headers.get("authorization").substring(7);

        PromesaEntity promesa = promesaRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("No se encontro la promesa con id:" + id));

        UsuarioEntity usuario = usuarioRepository.findById(promesaRequest.getOperador())
                .orElseThrow(() -> new NoSuchElementException("No se encontro al usuario con id:" + promesaRequest.getOperador()));

        if (jwtUtils.getRolFromToken(tokenHeader).equals(("ROLE_OPERADOR")) &&
                !promesa.getOperador().getNombreUsuario().equals(jwtUtils.getNombreUsuarioFromToken(tokenHeader))){
            throw new NoAutorizadoException("Credenciales invalidas.");
        }



        validarPromesa(promesaRequest);

        PromesaEntity promesaModificada = PromesaEntity.builder().
                id(promesa.getId())
                .idUsuarioML(promesaRequest.getIdUsuarioML())
                .numCaso(promesaRequest.getNumCaso())
                .monto(promesaRequest.getMonto())
                .site(promesaRequest.getSite())
                .canal(promesaRequest.getCanal())
                .tipoAcuerdo(promesaRequest.getTipoAcuerdo())
                .cumplimiento(promesaRequest.getCumplimiento())
                .fechaCarga(promesaRequest.getFechaCarga())
                .fechaPago(promesaRequest.getFechaPago())
                .operador(usuario)
                .build();

        promesaRepository.save(promesaModificada);

        PromesaResponse response = PromesaResponse.builder().
                id(promesaModificada.getId())
                .idUsuarioML(promesaModificada.getIdUsuarioML())
                .numCaso(promesaModificada.getNumCaso())
                .monto(promesaModificada.getMonto())
                .site(promesaModificada.getSite())
                .canal(promesaModificada.getCanal())
                .tipoAcuerdo(promesaModificada.getTipoAcuerdo())
                .cumplimiento(promesaModificada.getCumplimiento())
                .fechaCarga(promesaModificada.getFechaCarga())
                .fechaPago(promesaModificada.getFechaPago())
                .operador(promesaModificada.getOperador().getNombre())
                .build();

        return response;
    }

    public EstadisticaResponse getEstadisticas(Map<String, String> headers, @Valid List<PromesaExcelRequest> promesas) throws LogicaInvalidaException {

        if(promesas.isEmpty()){
            throw new LogicaInvalidaException("La tabla esta vacía.");
        }

        EstadisticaResponse response = new EstadisticaResponse();
        response.setCantPromesas(promesas.size());



        for (PromesaExcelRequest promesaRequest : promesas){

            if(promesaRequest.getSite().equals(MLA.getSite())){
                response.setCantPromesasMLA(response.getCantPromesasMLA()+1);
            }
            else if(promesaRequest.getSite().equals(MLM.getSite())){
                response.setCantPromesasMLM(response.getCantPromesasMLM()+1);
            }
            else if(promesaRequest.getSite().equals(Sites.MLC.getSite())){
                response.setCantPromesasMLC(response.getCantPromesasMLC()+1);
            }

            if (promesaRequest.getCumplimiento().equals(EstadosCumplimiento.EN_CURSO.getEstado())){
                response.setCantPromesasEnCurso(response.getCantPromesasEnCurso()+1);
                if (promesaDuplica(promesaRequest.getSite(), promesaRequest.getMonto())){
                    response.setCantPromesasDuplicadas(response.getCantPromesasDuplicadas()+1);
                    response.setCantPromesasDuplicadasEnCurso(response.getCantPromesasDuplicadasEnCurso()+1);
                }
            }
            else if (promesaRequest.getCumplimiento().equals(EstadosCumplimiento.CUMPLIDA.getEstado())){
                response.setCantPromesasCumplidas(response.getCantPromesasCumplidas()+1);
                if (promesaDuplica(promesaRequest.getSite(), promesaRequest.getMonto())){
                    response.setCantPromesasDuplicadas(response.getCantPromesasDuplicadas()+1);
                    response.setCantPromesasDuplicadasCumplidas(response.getCantPromesasDuplicadasCumplidas()+1);
                }
            }
            else if (promesaRequest.getCumplimiento().equals(EstadosCumplimiento.INCUMPLIDA.getEstado())){
                response.setCantPromesasIncumplidas(response.getCantPromesasIncumplidas()+1);
                if (promesaDuplica(promesaRequest.getSite(), promesaRequest.getMonto())){
                    response.setCantPromesasDuplicadas(response.getCantPromesasDuplicadas()+1);
                    response.setCantPromesasDuplicadasIncumplidas(response.getCantPromesasDuplicadasIncumplidas()+1);
                }
            }
        }

        return response;
    }

    public boolean promesaDuplica(String site, Double monto){
        if(site.equals(MLA.getSite()) && monto >= 250000){
            return true;
        }
        if(site.equals(MLC.getSite()) && monto >= 250000){
            return true;
        }
        if(site.equals(MLM.getSite()) && monto >= 5000){
            return true;
        }
        return false;
    }

    public byte[] getExcelTabla(Map<String, String> headers, @Valid List<PromesaExcelRequest> promesas) throws IOException, LogicaInvalidaException {

        if(promesas.isEmpty()){
            throw new LogicaInvalidaException("La tabla esta vacía.");
        }

        ClassPathResource plantilla = new ClassPathResource("PlantillaPromesas.xlsx");
        InputStream inputStream = plantilla.getInputStream();

        Workbook libro = new XSSFWorkbook(inputStream);
        Sheet hoja = libro.getSheetAt(0);

        int filaIndex = 1;

        for (PromesaExcelRequest promesaRequest : promesas){

            Font fuente = libro.createFont();
            fuente.setBold(true);

            CellStyle estilo = libro.createCellStyle();
            estilo.setFont(fuente);
            estilo.setAlignment(HorizontalAlignment.CENTER);
            estilo.setVerticalAlignment(VerticalAlignment.CENTER);

            estilo.setBorderTop(BorderStyle.THIN);
            estilo.setBorderBottom(BorderStyle.THIN);
            estilo.setBorderLeft(BorderStyle.THIN);
            estilo.setBorderRight(BorderStyle.THIN);

            estilo.setTopBorderColor(IndexedColors.BLACK.getIndex());
            estilo.setBottomBorderColor(IndexedColors.BLACK.getIndex());
            estilo.setLeftBorderColor(IndexedColors.BLACK.getIndex());
            estilo.setRightBorderColor(IndexedColors.BLACK.getIndex());


            Row fila = hoja.createRow(filaIndex++);
            Cell numCaso = fila.createCell(0);
            numCaso.setCellValue(promesaRequest.getNumCaso());
            numCaso.setCellStyle(estilo);

            Cell id = fila.createCell(1);
            id.setCellValue(promesaRequest.getIdUsuarioML());
            id.setCellStyle(estilo);

            Cell canal = fila.createCell(2);
            canal.setCellValue(promesaRequest.getCanal());
            canal.setCellStyle(estilo);

            Cell site = fila.createCell(3);
            site.setCellValue(promesaRequest.getSite());
            site.setCellStyle(estilo);

            Cell monto = fila.createCell(4);
            monto.setCellValue(promesaRequest.getMonto());
            monto.setCellStyle(estilo);

            CellStyle estiloFecha = libro.createCellStyle();
            estiloFecha.cloneStyleFrom(estilo);
            CreationHelper helper = libro.getCreationHelper();
            estiloFecha.setDataFormat(helper.createDataFormat().getFormat("dd/MM/yyyy"));


            Cell fechaCarga = fila.createCell(5);
            fechaCarga.setCellValue(promesaRequest.getFechaCarga());
            fechaCarga.setCellStyle(estiloFecha);

            Cell fechaPago = fila.createCell(6);
            fechaPago.setCellValue(promesaRequest.getFechaPago());
            fechaPago.setCellStyle(estiloFecha);

            Cell tipoAcuerdo = fila.createCell(7);
            tipoAcuerdo.setCellValue(promesaRequest.getTipoAcuerdo());
            tipoAcuerdo.setCellStyle(estilo);

            Cell operador = fila.createCell(8);
            operador.setCellValue(promesaRequest.getOperador());
            operador.setCellStyle(estilo);
        }

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        libro.write(outputStream);
        libro.close();

        return outputStream.toByteArray();
    }

    public void validarPromesa(PromesaRequest promesaRequest) throws LogicaInvalidaException {
        if(promesaRequest.getNumCaso() <= 0){
            throw new LogicaInvalidaException("El número de caso debe ser mayor a 0");
        }
        if(promesaRequest.getIdUsuarioML() <= 0){
            throw new LogicaInvalidaException("El id del usuario debe ser mayor a 0");
        }
        if (promesaRequest.getMonto() <= 0){
            throw new LogicaInvalidaException("El monto debe ser mayor a 0");
        }
        if (!Sites.siteValido(promesaRequest.getSite())){
            throw new LogicaInvalidaException("Site invalido");
        }
        if(!Canales.canalValido(promesaRequest.getCanal())){
            throw new LogicaInvalidaException("Canal invalido");
        }
        if (!TiposAcuerdo.acuerdoValido(promesaRequest.getTipoAcuerdo())){
            throw new LogicaInvalidaException("Tipo de acuerdo invalido");
        }
        if (!EstadosCumplimiento.cumplimientoValido(promesaRequest.getCumplimiento())){
            throw new LogicaInvalidaException("tipo de cumplimiento invalido");
        }

        long diasDiferencia = ChronoUnit.DAYS.between(promesaRequest.getFechaCarga(), promesaRequest.getFechaPago());

        if(diasDiferencia < 0){
            throw new LogicaInvalidaException("La fecha de pago no puede ser menor a la fecha de carga");
        }
        else if (diasDiferencia > 7){
            throw new LogicaInvalidaException("La diferencia de días entre la fecha de carga y la fecha de pago no puede ser mayor a 7 días");
        }
    }
}
