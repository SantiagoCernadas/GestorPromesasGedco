package com.crmpps.Backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ErrorDTO {
    private String codigo;
    private String mensaje;
}
