package com.crmpps.Backend.repository;

import com.crmpps.Backend.entity.PromesaEntity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class PromesaCustomRepository {
    @PersistenceContext
    private EntityManager em;

    public List<PromesaEntity> filtrar(
            Integer caso,
            Integer usuarioML,
            String canal,
            String site,
            String tipoAcuerdo,
            String tipoCumplimiento,
            LocalDate fechaCargaDesde,
            LocalDate fechaCargaHasta,
            Long operador,
            Boolean duplica
    ) {
        StringBuilder sb = new StringBuilder("SELECT a FROM promesa_pago a WHERE 1=1 ");
        Map<String, Object> params = new HashMap<>();

        if (caso != null) {
            sb.append("AND a.numCaso = :caso ");
            params.put("caso", caso);
        }
        if (usuarioML != null) {
            sb.append("AND a.idUsuarioML = :usuarioML ");
            params.put("usuarioML", usuarioML);
        }
        if (canal != null && !canal.isBlank()) {
            sb.append("AND LOWER(a.canal) = LOWER(:canal) ");
            params.put("canal", canal);
        }
        if (site != null && !site.isBlank()) {
            sb.append("AND LOWER(a.site) = LOWER(:site) ");
            params.put("site", site);
        }
        if (tipoAcuerdo != null && !tipoAcuerdo.isBlank()) {
            sb.append("AND LOWER(a.tipoAcuerdo) = LOWER(:tipoAcuerdo) ");
            params.put("tipoAcuerdo", tipoAcuerdo);
        }
        if (tipoCumplimiento != null && !tipoCumplimiento.isBlank()) {
            sb.append("AND LOWER(a.cumplimiento) = LOWER(:tipoCumplimiento) ");
            params.put("tipoCumplimiento", tipoCumplimiento);
        }
        if (operador != null) {
            sb.append("AND a.operador.id = :operador ");
            params.put("operador", operador);
        }
        if (fechaCargaDesde != null) {
            sb.append("AND a.fechaCarga >= :fechaCargaDesde ");
            params.put("fechaCargaDesde", fechaCargaDesde);
        }
        if (fechaCargaHasta != null) {
            sb.append("AND a.fechaCarga <= :fechaCargaHasta ");
            params.put("fechaCargaHasta", fechaCargaHasta);
        }
        if (Boolean.TRUE.equals(duplica)) {
            sb.append("AND ((LOWER(a.site) = 'mla' AND a.monto >= 250000) ")
                    .append("OR (LOWER(a.site) = 'mlm' AND a.monto >= 5000) ")
                    .append("OR (LOWER(a.site) = 'mlc' AND a.monto >= 200000)) ");
        }

        sb.append("order by a.fechaCarga desc");

        var query = em.createQuery(sb.toString(), PromesaEntity.class);
        params.forEach(query::setParameter);

        return query.getResultList();
    }
}
