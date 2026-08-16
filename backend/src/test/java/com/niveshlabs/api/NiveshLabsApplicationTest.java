package com.niveshlabs.api;

import static org.assertj.core.api.Assertions.assertThat;

import com.niveshlabs.api.admin.AdminUserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootTest(properties = {
    "niveshlabs.admin.email=admin-test@niveshlabs.local",
    "niveshlabs.admin.password=test-password-that-is-not-for-production",
    "niveshlabs.admin.display-name=Test Admin"
})
class NiveshLabsApplicationTest {

    @Autowired
    private AdminUserRepository adminUsers;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    void migratesTheDatabaseAndCreatesAHashedAdminAccount() {
        var admin = adminUsers.findByEmailIgnoreCase("admin-test@niveshlabs.local").orElseThrow();

        assertThat(admin.getDisplayName()).isEqualTo("Test Admin");
        assertThat(admin.getPasswordHash()).doesNotContain("test-password-that-is-not-for-production");
        assertThat(passwordEncoder.matches(
            "test-password-that-is-not-for-production",
            admin.getPasswordHash()
        )).isTrue();
    }
}
