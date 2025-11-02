package com.crmpps.Backend.repository;

import com.crmpps.Backend.dto.PromesaResponse;
import com.crmpps.Backend.entity.PromesaEntity;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface PromesaRepository extends CrudRepository<PromesaEntity,Long>, JpaSpecificationExecutor<PromesaEntity> {
}
