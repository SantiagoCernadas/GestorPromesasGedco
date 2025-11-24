package com.crmpps.Backend.config;

import com.crmpps.Backend.repository.UsuarioRepository;
import com.crmpps.Backend.service.UserDetailsServiceImpl;
import com.crmpps.Backend.util.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthorizationFilter authorizationFilter;

    @Autowired
    UserDetailsServiceImpl userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity,
                                                   AuthenticationManager authenticationManager) throws Exception {
        return httpSecurity
                .csrf(config -> config.disable())
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(auth ->{
                    auth.requestMatchers("/hello").permitAll();
                    auth.requestMatchers("/helloSeguro").hasAnyRole("SUPERVISOR","OPERADOR");
                    auth.requestMatchers(
                            "/swagger-ui/**",
                            "/swagger-ui.html",
                            "/v3/api-docs/**"
                    ).permitAll();
                    auth.requestMatchers("/auth/login").permitAll();
                    auth.anyRequest().authenticated();
                })
                .sessionManagement(session -> {
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS);
                })
                //Filtro para autenticar mediante JWT
                .addFilterBefore(authorizationFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    //Encriptar contraseña. Nos lo pide la funcion de autenticacion.
    @Bean
    public  PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    //Se encarga de administrar la autenticación en nuestra app.
    //1 hora con 4mins video tuto.
    @Bean
    public AuthenticationManager authenticationManager() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());

        return new ProviderManager(provider);
    }

}
