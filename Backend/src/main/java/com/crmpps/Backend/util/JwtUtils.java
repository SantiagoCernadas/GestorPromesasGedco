package com.crmpps.Backend.util;

//Clase que nos permite trabajar con JWT.

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtils {

    @Value("${jwt.secret.key}")
    private String secret;

    @Value("${jwt.time.expiration}")
    private String tiempoExpiracion;

    //Generar Token de acceso
    public String generarToken(String nombreUsuario){
        return Jwts.builder()
                .setSubject(nombreUsuario)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + Long.parseLong(tiempoExpiracion)))
                .signWith(getClaveFirma(), SignatureAlgorithm.HS256)
                .compact();
    }

    //Validar Token
    public boolean tokenValido(String token){
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getClaveFirma())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            //Si a la hora de parsear el jwt, este tira una excepción, significa que el token es invalido.
            // De lo contrario, es valido
            return  true;
        } catch (Exception e){
            return false;
        }
    }

    public String getNombreUsuarioFromToken(String token){
        return getClaim(token,Claims::getSubject);
    }

    //Obtener un solo claim
    public <T> T getClaim(String token, Function<Claims,T> claimsTFunction){
        Claims claims = extraerClaims(token);
        return claimsTFunction.apply(claims);
    }

    //Obtener todos los "claims" (Data/Payloads) del token
    public Claims extraerClaims(String token){
        return Jwts.parserBuilder()
                .setSigningKey(getClaveFirma())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    //Obtener Firma del token (Secret)
    public Key getClaveFirma(){
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
