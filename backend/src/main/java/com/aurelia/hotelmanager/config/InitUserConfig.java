package com.aurelia.hotelmanager.config;

import com.aurelia.hotelmanager.model.User;
import com.aurelia.hotelmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class InitUserConfig {

    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner encodeExistingUserPasswords(UserRepository userRepository) {
        return args -> userRepository.findAll().forEach(user -> {
            if (user.getPassword() != null && !isBcryptHash(user.getPassword())) {
                user.setPassword(passwordEncoder.encode(user.getPassword()));
                userRepository.save(user);
            }
        });
    }

    private boolean isBcryptHash(String password) {
        return password.startsWith("$2a$")
                || password.startsWith("$2b$")
                || password.startsWith("$2y$");
    }
}
