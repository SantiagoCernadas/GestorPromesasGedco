package com.crmpps.Backend.config;


import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "CRM de PPS",
                version = "1.0.0",
                description = "CRM de promesas de pago, proyecto para la uni."
        )
)
public class OpenApiConfig {
}
