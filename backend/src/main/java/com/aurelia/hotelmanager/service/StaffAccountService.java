package com.aurelia.hotelmanager.service;

import com.aurelia.hotelmanager.dto.request.StaffAccountRequest;
import com.aurelia.hotelmanager.dto.request.StaffAccountUpdateRequest;
import com.aurelia.hotelmanager.dto.response.StaffAccountResponse;
import com.aurelia.hotelmanager.model.AccountStatus;
import com.aurelia.hotelmanager.model.Role;
import com.aurelia.hotelmanager.model.User;
import com.aurelia.hotelmanager.repository.RoleRepository;
import com.aurelia.hotelmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StaffAccountService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AvatarStorageService avatarStorageService;

    public List<StaffAccountResponse> list() {
        return userRepository.findAllByOrderByCreatedAtDesc().stream()
                .filter(this::isManagedStaff)
                .map(this::toResponse)
                .toList();
    }

    public StaffAccountResponse create(StaffAccountRequest request) {
        return create(request, null);
    }

    public StaffAccountResponse create(StaffAccountRequest request, MultipartFile avatar) {
        String email = normalizeEmail(request.getEmail());
        ensureEmailAvailable(email, null);
        NameParts name = parseName(request.getFullName());
        Role role = getStaffRole(request.getRoleName());

        User user = User.builder()
                .firstName(name.firstName())
                .lastName(name.lastName())
                .email(email)
                .department(normalizeOptional(request.getDepartment()))
                .password(passwordEncoder.encode(request.getPassword()))
                .status(AccountStatus.ACTIVE)
                .roles(new java.util.HashSet<>(Set.of(role)))
                .build();

        User saved = userRepository.save(user);
        if (avatar != null && !avatar.isEmpty()) {
            try {
                avatarStorageService.upload(saved, avatar, "/auth/staff/" + saved.getId() + "/avatar");
            } catch (RuntimeException exception) {
                userRepository.delete(saved);
                throw exception;
            }
        }
        return toResponse(saved);
    }

    public StaffAccountResponse update(Long id, StaffAccountUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Không tìm thấy tài khoản nhân viên"));
        String email = normalizeEmail(request.getEmail());
        ensureEmailAvailable(email, id);
        NameParts name = parseName(request.getFullName());
        Role role = getStaffRole(request.getRoleName());

        user.setFirstName(name.firstName());
        user.setLastName(name.lastName());
        user.setEmail(email);
        user.setDepartment(normalizeOptional(request.getDepartment()));
        user.setRoles(new java.util.HashSet<>(Set.of(role)));
        user.setStatus(resolveStatus(request));

        return toResponse(userRepository.save(user));
    }

    private StaffAccountResponse toResponse(User user) {
        List<StaffAccountResponse.RoleSummaryResponse> roles = user.getRoles().stream()
                .map(role -> new StaffAccountResponse.RoleSummaryResponse(role.getId(), role.getName()))
                .toList();
        return new StaffAccountResponse(
                user.getId(),
                user.getFirstName() + " " + user.getLastName(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getDepartment(),
                user.getStatus(),
                user.getStatus() == AccountStatus.ACTIVE,
                user.getCreatedAt(),
                user.getUpdatedAt(),
                roles,
                user.getAvatarObjectKey() == null
                        ? null
                        : "/auth/staff/" + user.getId() + "/avatar");
    }

    private boolean isManagedStaff(User user) {
        return user.getRoles().stream()
                .noneMatch(role -> "ADMIN".equalsIgnoreCase(role.getName()));
    }

    private AccountStatus resolveStatus(StaffAccountUpdateRequest request) {
        if (request.getStatus() == null) {
            return request.getEnabled() ? AccountStatus.ACTIVE : AccountStatus.SUSPENDED;
        }
        if (request.getStatus() == AccountStatus.INACTIVE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Không thể đặt tài khoản nhân viên về trạng thái không hoạt động");
        }
        return request.getStatus();
    }

    private Role getStaffRole(String roleName) {
        String normalized = normalizeRole(roleName);
        if ("ADMIN".equals(normalized)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Không thể gán role ADMIN cho tài khoản nhân viên");
        }
        return roleRepository.findByName(normalized)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Role không tồn tại, hãy chọn role từ danh sách"));
    }

    private void ensureEmailAvailable(String email, Long currentId) {
        userRepository.findByEmail(email).ifPresent(existing -> {
            if (currentId == null || !existing.getId().equals(currentId)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "Email đã được sử dụng bởi tài khoản khác");
            }
        });
    }

    private NameParts parseName(String fullName) {
        String normalized = fullName == null ? "" : fullName.trim().replaceAll("\\s+", " ");
        String[] parts = normalized.split(" ");
        if (parts.length < 2 || parts[0].isBlank() || parts[parts.length - 1].isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Họ tên phải có cả họ và tên");
        }
        String firstName = parts[0];
        String lastName = Arrays.stream(parts).skip(1).collect(Collectors.joining(" "));
        return new NameParts(firstName, lastName);
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private String normalizeOptional(String value) {
        if (value == null) return null;
        String normalized = value.trim();
        return normalized.isEmpty() ? null : normalized;
    }

    private String normalizeRole(String roleName) {
        return roleName.trim().replace('-', '_').replace(' ', '_').toUpperCase(Locale.ROOT);
    }

    private record NameParts(String firstName, String lastName) {
    }
}
