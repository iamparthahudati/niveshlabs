package com.niveshlabs.api.admin;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminAccountInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminAccountInitializer.class);

    private final AdminUserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final String email;
    private final String password;
    private final String displayName;

    public AdminAccountInitializer(
        AdminUserRepository repository,
        PasswordEncoder passwordEncoder,
        @Value("${niveshlabs.admin.email}") String email,
        @Value("${niveshlabs.admin.password}") String password,
        @Value("${niveshlabs.admin.display-name}") String displayName
    ) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.email = email;
        this.password = password;
        this.displayName = displayName;
    }

    @Override
    public void run(String... args) {
        if (password == null || password.isBlank()) {
            log.warn("ADMIN_PASSWORD is empty; no initial admin account was created.");
            return;
        }

        repository.findByEmailIgnoreCase(email).orElseGet(() -> {
            log.info("Creating the initial NiveshLabs admin account for {}", email);
            return repository.save(new AdminUser(email, displayName, passwordEncoder.encode(password)));
        });
    }
}
