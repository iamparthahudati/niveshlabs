package com.niveshlabs.api.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.niveshlabs.api.admin.AdminUser;
import com.niveshlabs.api.admin.AdminUserRepository;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final AdminUserRepository adminUsers;
    private final SecurityContextRepository securityContextRepository =
        new HttpSessionSecurityContextRepository();

    public AuthController(AuthenticationManager authenticationManager, AdminUserRepository adminUsers) {
        this.authenticationManager = authenticationManager;
        this.adminUsers = adminUsers;
    }

    @GetMapping("/csrf")
    public CsrfResponse csrf(CsrfToken token) {
        return new CsrfResponse(token.getToken(), token.getHeaderName());
    }

    @PostMapping("/login")
    public AdminSession login(
        @Valid @RequestBody LoginRequest login,
        HttpServletRequest request,
        HttpServletResponse response
    ) {
        Authentication authentication = authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken.unauthenticated(login.email(), login.password())
        );

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
        securityContextRepository.saveContext(context, request, response);

        return session(authentication);
    }

    @GetMapping("/me")
    public AdminSession me(Authentication authentication) {
        return session(authentication);
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(HttpServletRequest request) {
        request.getSession().invalidate();
        SecurityContextHolder.clearContext();
    }

    private AdminSession session(Authentication authentication) {
        AdminUser admin = adminUsers.findByEmailIgnoreCase(authentication.getName())
            .orElseThrow();
        return new AdminSession(admin.getEmail(), admin.getDisplayName(), admin.getRole());
    }

    public record LoginRequest(@NotBlank @Email String email, @NotBlank String password) {}
    public record AdminSession(String email, String displayName, String role) {}
    public record CsrfResponse(String token, String headerName) {}
}
