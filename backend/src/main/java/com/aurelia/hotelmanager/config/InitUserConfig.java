package com.aurelia.hotelmanager.config;

import com.aurelia.hotelmanager.model.AccountStatus;
import com.aurelia.hotelmanager.model.Role;
import com.aurelia.hotelmanager.model.User;
import com.aurelia.hotelmanager.repository.UserRepository;
import com.aurelia.hotelmanager.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class InitUserConfig {

    private final PasswordEncoder passwordEncoder;

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password}")
    private String adminPassword;

    @Value("${admin.first-name}")
    private String adminFirstName;

    @Value("${admin.last-name}")
    private String adminLastName;

    @Bean
    public CommandLineRunner initializeUsers(UserRepository userRepository,
                                             RoleRepository roleRepository) {
        return args -> {
            Role adminRole = roleRepository.findByName("ADMIN")
                    .orElseGet(() -> roleRepository.save(Role.builder()
                            .name("ADMIN")
                            .description("Quản trị viên hệ thống")
                            .build()));

            userRepository.findByEmail(adminEmail).ifPresentOrElse(user -> {
                user.getRoles().add(adminRole);
                user.setStatus(AccountStatus.ACTIVE);
                userRepository.save(user);
            }, () -> {
                User admin = User.builder()
                        .firstName(adminFirstName)
                        .lastName(adminLastName)
                        .email(adminEmail)
                        .password(passwordEncoder.encode(adminPassword))
                        .status(AccountStatus.ACTIVE)
                        .build();
                admin.getRoles().add(adminRole);
                userRepository.save(admin);
            });

            userRepository.findAll().forEach(user -> {
            if (user.getPassword() != null && !isBcryptHash(user.getPassword())) {
                user.setPassword(passwordEncoder.encode(user.getPassword()));
                userRepository.save(user);
            }
            });
        };
    }

    private boolean isBcryptHash(String password) {
        return password.startsWith("$2a$")
                || password.startsWith("$2b$")
                || password.startsWith("$2y$");
    }
}
