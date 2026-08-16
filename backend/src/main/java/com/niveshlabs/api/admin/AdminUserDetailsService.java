package com.niveshlabs.api.admin;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AdminUserDetailsService implements UserDetailsService {

    private final AdminUserRepository repository;

    public AdminUserDetailsService(AdminUserRepository repository) {
        this.repository = repository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        AdminUser admin = repository.findByEmailIgnoreCase(email)
            .orElseThrow(() -> new UsernameNotFoundException("Admin account not found"));

        return User.withUsername(admin.getEmail())
            .password(admin.getPasswordHash())
            .roles(admin.getRole())
            .disabled(!admin.isEnabled())
            .build();
    }
}
