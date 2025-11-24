package com.crmpps.Backend.util;

//Clase que nos permite trabajar con JWT.

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtils {

    @Value("${jwt.secret.key}")
    private String secret;

    @Value("${jwt.time.expiration}")
    private String tiempoExpiracion;

    public String generarToken(UserDetails userDetails) {
        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .claim("roles", userDetails.getAuthorities())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + Long.parseLong(tiempoExpiracion)))
                .signWith(getClaveFirma(), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean tokenValido(String token){
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getClaveFirma())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return  true;
        } catch (Exception e){
            return false;
        }
    }

    public String getNombreUsuarioFromToken(String token) {
        return getClaim(token, Claims::getSubject);
    }

    public String getRolFromToken(String token){
        Claims claims = extraerClaims(token);

        List<Map<String, String>> roles = claims.get("roles", List.class);

        return roles.get(0).get("authority");
    }

    public <T> T getClaim(String token, Function<Claims,T> claimsTFunction){
        Claims claims = extraerClaims(token);
        return claimsTFunction.apply(claims);
    }

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
