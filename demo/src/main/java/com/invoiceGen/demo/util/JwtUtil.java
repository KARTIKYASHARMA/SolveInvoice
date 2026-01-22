package com.invoiceGen.demo.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtil {

    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration:3600000}") // default 1 hour
    private long jwtExpirationMs;

    private SecretKey key;

    // -------------------------
    // INITIALIZE SECRET KEY
    // -------------------------
    @PostConstruct
    public void init() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        this.key = Keys.hmacShaKeyFor(keyBytes);
        logger.info("JWT Secret Key initialized");
    }

    private SecretKey getSecretKey() {
        return this.key;
    }

    // -------------------------
    // GENERATE TOKEN (EMAIL)
    // -------------------------
    public String generateToken(String email) {
        logger.info("Generating JWT for user: {}", email);

        Date now = new Date();
        Date expiry = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .subject(email)
                .issuedAt(now)
                .expiration(expiry)
                .signWith(getSecretKey()) // ✅ JJWT 0.12.x
                .compact();
    }

    // -------------------------
    // EXTRACT EMAIL
    // -------------------------
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // -------------------------
    // VALIDATE TOKEN
    // -------------------------
    public boolean validateToken(String token, String email) {
        try {
            final String username = extractUsername(token);
            boolean valid = username.equals(email) && !isTokenExpired(token);

            if (valid) {
                logger.info("JWT valid for user: {}", email);
            } else {
                logger.warn("JWT invalid or expired for user: {}", email);
            }

            return valid;
        } catch (Exception e) {
            logger.error("JWT validation failed: {}", e.getMessage());
            return false;
        }
    }

    // -------------------------
    // INTERNAL HELPERS
    // -------------------------
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSecretKey()) // ✅ JJWT 0.12.x
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
