package com.aurelia.hotelmanager.config;

import com.aurelia.hotelmanager.model.AccountStatus;
import com.aurelia.hotelmanager.model.Permission;
import com.aurelia.hotelmanager.model.Role;
import com.aurelia.hotelmanager.model.User;
import com.aurelia.hotelmanager.repository.PermissionRepository;
import com.aurelia.hotelmanager.repository.UserRepository;
import com.aurelia.hotelmanager.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Objects;

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
                                             RoleRepository roleRepository,
                                             PermissionRepository permissionRepository) {
        return args -> {
            Role adminRole = roleRepository.findByName("ADMIN")
                    .orElseGet(() -> roleRepository.save(Role.builder()
                            .name("ADMIN")
                            .description("Quản trị viên hệ thống")
                            .build()));
            ensureRole(roleRepository, "MANAGER", "Oversees daily hotel performance");
            ensureRole(roleRepository, "RECEPTIONIST", "Reservations and guest arrivals");
            ensureRole(roleRepository, "HOUSEKEEPER", "Room readiness and service");
            ensureRole(roleRepository, "TECHNICIAN", "Repairs and room operations");

            Permission dashboardView = permissionRepository.findByCode("DASHBOARD_VIEW")
                    .orElseGet(() -> permissionRepository.save(Permission.builder()
                            .code("DASHBOARD_VIEW")
                            .name("View dashboard")
                            .description("View the staff dashboard")
                            .build()));
            Permission manageRoles = permissionRepository.findByCode("ROLE_MANAGE_ROLES")
                    .orElseGet(() -> permissionRepository.save(Permission.builder()
                            .code("ROLE_MANAGE_ROLES")
                            .name("Manage staff accounts")
                            .description("Manage staff accounts and access")
                            .build()));
            Permission updateAccount = permissionRepository.findByCode("ACCOUNT_UPDATE")
                    .orElseGet(() -> permissionRepository.save(Permission.builder()
                            .code("ACCOUNT_UPDATE")
                            .name("Update account information")
                            .description("Update your own account information")
                            .build()));
            Permission createRole = permissionRepository.findByCode("ROLE_CREATE")
                    .orElseGet(() -> permissionRepository.save(Permission.builder()
                            .code("ROLE_CREATE")
                            .name("Create roles")
                            .description("Create new access roles")
                            .build()));
            Permission updateRole = permissionRepository.findByCode("ROLE_UPDATE")
                    .orElseGet(() -> permissionRepository.save(Permission.builder()
                            .code("ROLE_UPDATE")
                            .name("Edit roles")
                            .description("Update role names and descriptions")
                            .build()));
            Permission deleteRole = permissionRepository.findByCode("ROLE_DELETE")
                    .orElseGet(() -> permissionRepository.save(Permission.builder()
                            .code("ROLE_DELETE")
                            .name("Delete roles")
                            .description("Delete roles that are no longer needed")
                            .build()));
            Permission managePermissions = permissionRepository.findByCode("ROLE_MANAGE_PERMISSIONS")
                    .orElseGet(() -> permissionRepository.save(Permission.builder()
                            .code("ROLE_MANAGE_PERMISSIONS")
                            .name("Update permissions")
                            .description("Assign permissions to access roles")
                            .build()));
            Permission manageRoomTypes = permissionRepository.findByCode("ROOM_MANAGE_TYPES")
                    .orElseGet(() -> permissionRepository.save(Permission.builder()
                            .code("ROOM_MANAGE_TYPES")
                            .name("Manage room types")
                            .description("Create and update hotel room types")
                            .build()));
            Permission manageRooms = permissionRepository.findByCode("ROOM_MANAGE_ROOMS")
                    .orElseGet(() -> permissionRepository.save(Permission.builder()
                            .code("ROOM_MANAGE_ROOMS")
                            .name("Manage rooms")
                            .description("View and create hotel rooms")
                            .build()));
            adminRole.getPermissions().add(dashboardView);
            adminRole.getPermissions().add(manageRoles);
            adminRole.getPermissions().add(updateAccount);
            adminRole.getPermissions().add(createRole);
            adminRole.getPermissions().add(updateRole);
            adminRole.getPermissions().add(deleteRole);
            adminRole.getPermissions().add(managePermissions);
            adminRole.getPermissions().add(manageRoomTypes);
            adminRole.getPermissions().add(manageRooms);
            roleRepository.save(adminRole);

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

    private Role ensureRole(RoleRepository roleRepository, String name, String description) {
        Role role = roleRepository.findByName(name)
                .orElseGet(() -> roleRepository.save(Role.builder()
                        .name(name)
                        .description(description)
                        .build()));
        if (!Objects.equals(role.getDescription(), description)) {
            role.setDescription(description);
            role = roleRepository.save(role);
        }
        return role;
    }
}
