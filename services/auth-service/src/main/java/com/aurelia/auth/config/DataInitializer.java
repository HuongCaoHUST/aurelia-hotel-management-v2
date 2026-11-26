package com.aurelia.auth.config;

import com.aurelia.auth.entity.Role;
import com.aurelia.auth.entity.Permission;
import com.aurelia.auth.repository.PermissionRepository;
import com.aurelia.auth.entity.User;
import com.aurelia.auth.repository.RoleRepository;
import com.aurelia.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.HashSet;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Initialize default roles and test user on startup
     */
    @Bean
    public CommandLineRunner initializeData() {
        return args -> {
            // Seed defaults once; all subsequent roles and permissions are database records.
            Arrays.asList("CUSTOMER", "RECEPTIONIST", "HOUSEKEEPER", "TECHNICIAN", "MANAGER", "ADMIN").forEach(roleName -> {
                if (roleRepository.findByName(roleName).isEmpty()) {
                    Role role = Role.builder()
                        .name(roleName)
                            .description("Role: " + roleName)
                            .build();
                    roleRepository.save(role);
                    log.info("Created role: {}", roleName);
                }
            });

            Arrays.asList("ROLE_MANAGE_ROLES", "ROLE_MANAGE_PERMISSIONS").forEach(code ->
                    permissionRepository.findByCode(code).orElseGet(() -> permissionRepository.save(
                            Permission.builder().code(code).description(code).build())));

            Role admin = roleRepository.findByName("ADMIN").orElseThrow();
            admin.getPermissions().add(permissionRepository.findByCode("ROLE_MANAGE_ROLES").orElseThrow());
            admin.getPermissions().add(permissionRepository.findByCode("ROLE_MANAGE_PERMISSIONS").orElseThrow());
            roleRepository.save(admin);

            // Create test user if doesn't exist
            if (!userRepository.existsByEmail("admin@example.com")) {
                Role adminRole = roleRepository.findByName("ADMIN")
                        .orElseThrow(() -> new RuntimeException("ADMIN role not found"));
                Role customerRole = roleRepository.findByName("CUSTOMER")
                        .orElseThrow(() -> new RuntimeException("CUSTOMER role not found"));

                User adminUser = User.builder()
                        .email("admin@example.com")
                        .passwordHash(passwordEncoder.encode("admin123"))
                        .fullName("Admin User")
                        .phone("0123456789")
                        .enabled(true)
                        .roles(new HashSet<>(Arrays.asList(adminRole, customerRole)))
                        .build();
                userRepository.save(adminUser);
                log.info("Created test admin user: admin@example.com");
            }

            // Create test customer if doesn't exist
            if (!userRepository.existsByEmail("customer@example.com")) {
                Role customerRole = roleRepository.findByName("CUSTOMER")
                        .orElseThrow(() -> new RuntimeException("CUSTOMER role not found"));

                User customerUser = User.builder()
                        .email("customer@example.com")
                        .passwordHash(passwordEncoder.encode("customer123"))
                        .fullName("Customer User")
                        .phone("0987654321")
                        .enabled(true)
                        .roles(new HashSet<>(Arrays.asList(customerRole)))
                        .build();
                userRepository.save(customerUser);
                log.info("Created test customer user: customer@example.com");
            }
        };
    }
}
