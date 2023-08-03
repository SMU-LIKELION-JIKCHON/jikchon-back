package smu.likelion.jikchon.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;
import smu.likelion.jikchon.domain.Member;
import smu.likelion.jikchon.dto.member.TokenResponseDto;
import smu.likelion.jikchon.exception.CustomUnauthorizedException;
import smu.likelion.jikchon.exception.ErrorCode;

import java.security.Key;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class TokenProvider {
    private static final String TOKEN_TYPE = "Bearer";
    private static final String AUTHORITY_KEY = "auth";
    private static final String REFRESH_TOKEN_HEADER = "Refresh_Token";
    public static final long JWT_ACCESS_TOKEN_VALIDITY = 2 * 60 * 60 * 1000L;
    public static final long JWT_REFRESH_TOKEN_VALIDITY = 7 * 24 * 60 * 60 * 1000L;
    @Value("${jwt.secret-key}")
    private String accessTokenSecretKey;

    @Value("${jwt.secret-key}")
    private String refreshTokenSecretKey;
    private Key accessTokenKey;
    private Key refershTokenKey;

    @PostConstruct
    public void init() {
        accessTokenKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(accessTokenSecretKey));
        refershTokenKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(refreshTokenSecretKey));
    }
    public String generateAccessToken(Member member) {
        return Jwts.builder()
                .setIssuer("jikchon")
                .setSubject(member.getId().toString())
                .claim(AUTHORITY_KEY, member.getRole().toString())
                .setExpiration(new Date(new Date().getTime() + JWT_ACCESS_TOKEN_VALIDITY))
                .signWith(accessTokenKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateAccessToken(long nowSecond, Authentication authentication) {
        return Jwts.builder()
                .setIssuer("jikchon")
                .setSubject(authentication.getName())
                .claim(AUTHORITY_KEY, authentication.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority).collect(Collectors.joining(",")))
                .setExpiration(new Date(nowSecond + JWT_ACCESS_TOKEN_VALIDITY))
                .signWith(accessTokenKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateRefreshToken(long nowSecond, Authentication authentication) {
        return Jwts.builder()
                .setIssuer("jikchon")
                .setSubject(authentication.getName())
                .setExpiration(new Date(nowSecond + JWT_REFRESH_TOKEN_VALIDITY))
                .signWith(refershTokenKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public TokenResponseDto.FullInfo generateTokenResponse(Authentication authentication) {
        long nowSecond = new Date().getTime();
        return TokenResponseDto.FullInfo.builder()
                .accessToken(generateAccessToken(nowSecond, authentication))
                .expiresIn(nowSecond + JWT_ACCESS_TOKEN_VALIDITY)
                .refreshToken(generateRefreshToken(nowSecond, authentication))
                .refreshTokenExpiresIn(nowSecond + JWT_REFRESH_TOKEN_VALIDITY)
                .build();
    }

    public TokenResponseDto.AccessToken generateTokenResponse(Member member) {
        return TokenResponseDto.AccessToken.builder()
                .accessToken(generateAccessToken(member))
                .build();
    }


    public Authentication getAuthentication(String token) {
        Claims claims = parseClaims(token, accessTokenKey);

        if (ObjectUtils.isEmpty(claims.get(AUTHORITY_KEY))) {
            throw new CustomUnauthorizedException(ErrorCode.INVALID_TOKEN);
        }

        Collection<? extends GrantedAuthority> authority = Collections.singleton(new SimpleGrantedAuthority(claims.get(AUTHORITY_KEY).toString()));
        return new UsernamePasswordAuthenticationToken(claims.getSubject(), "", authority);
    }

    public void validateAccessToken(String token) {
        parseAccessTokenClaims(token);
    }

    public Long getMemberIdFromRefreshToken(String refreshToken) {
        return Long.valueOf(parseRefreshTokenClaims(refreshToken).getSubject());
    }

    public Claims parseAccessTokenClaims(String token) {
        return parseClaims(token, accessTokenKey);
    }
    public Claims parseRefreshTokenClaims(String token) {
        return parseClaims(token, refershTokenKey);
    }

    private Claims parseClaims(String token, Key key) {
        try {
            return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
        } catch (ExpiredJwtException e) {
            throw new CustomUnauthorizedException(ErrorCode.EXPIRED_TOKEN);
        } catch (Exception e) {
            throw new CustomUnauthorizedException(ErrorCode.INVALID_TOKEN);
        }
    }

    public String getAccessToken(HttpServletRequest request) {
        String token = Optional.ofNullable(request.getHeader(HttpHeaders.AUTHORIZATION)).orElseThrow(() ->
                new CustomUnauthorizedException(ErrorCode.LOGIN_REQUIRED));

        if (!StringUtils.hasText(token) || !StringUtils.startsWithIgnoreCase(token, TOKEN_TYPE)) {
            throw new CustomUnauthorizedException(ErrorCode.INVALID_TOKEN);
        }

        return token.substring(7);
    }

    public String getRefreshToken(HttpServletRequest request) {
        String token = getCookieByName(request, REFRESH_TOKEN_HEADER).orElseThrow(() ->
                new CustomUnauthorizedException(ErrorCode.REFRESH_TOKEN_NOT_EXIST)
        );

        if (!StringUtils.hasText(token) || !StringUtils.startsWithIgnoreCase(token, TOKEN_TYPE)) {
            throw new CustomUnauthorizedException(ErrorCode.INVALID_TOKEN);
        }

        return token.substring(7);
    }

    private Optional<String> getCookieByName(HttpServletRequest request, String name) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals(name)) {
                    return Optional.of(cookie.getValue());
                }
            }
        }
        return Optional.empty();
    }
}
