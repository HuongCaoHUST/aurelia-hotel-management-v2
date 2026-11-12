package com.aurelia.hotelmanager.service;

import com.aurelia.hotelmanager.dto.response.PermissionAccessResponse;
import com.aurelia.hotelmanager.dto.response.RoleAccessResponse;
import com.aurelia.hotelmanager.model.Permission;
import com.aurelia.hotelmanager.model.Role;
import com.aurelia.hotelmanager.repository.PermissionRepository;
import com.aurelia.hotelmanager.repository.RoleRepository;
import com.aurelia.hotelmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.HashSet;

@Service
@RequiredArgsConstructor
public class AccessControlService {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final UserRepository userRepository;

    public List<RoleAccessResponse> listRoles() {
        return roleRepository.findAll(Sort.by(Sort.Direction.ASC, "name")).stream()
                .map(RoleAccessResponse::new)
                .toList();
    }

    public List<PermissionAccessResponse> listPermissions() {
        return permissionRepository.findAll(Sort.by(Sort.Direction.ASC, "code")).stream()
                .map(PermissionAccessResponse::new)
                .toList();
    }

    @Transactional
    public RoleAccessResponse createRole(String name, String description, List<Long> permissionIds) {
        String normalizedName = normalizeRoleName(name);
        if (roleRepository.existsByName(normalizedName)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Role đã tồn tại");
        }

        Role role = Role.builder()
                .name(normalizedName)
                .description(normalizeDescription(description))
                .build();
        role.setPermissions(new HashSet<>(resolvePermissions(permissionIds)));
        return new RoleAccessResponse(roleRepository.save(role));
    }

    @Transactional
    public RoleAccessResponse updateRole(Long roleId, String name, String description, List<Long> permissionIds) {
        Role role = findRole(roleId);
        String normalizedName = normalizeRoleName(name);
        roleRepository.findByName(normalizedName).ifPresent(existing -> {
            if (!existing.getId().equals(roleId)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Role đã tồn tại");
            }
        });

        role.setName(normalizedName);
        role.setDescription(normalizeDescription(description));
        role.setPermissions(new HashSet<>(resolvePermissions(permissionIds)));
        return new RoleAccessResponse(roleRepository.save(role));
    }

    @Transactional
    public void deleteRole(Long roleId) {
        Role role = findRole(roleId);
        if ("ADMIN".equalsIgnoreCase(role.getName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Không thể xóa role ADMIN");
        }
        if (userRepository.existsByRoles_Id(roleId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Không thể xóa role đang được gán cho tài khoản");
        }
        roleRepository.delete(role);
    }

    public RoleAccessResponse replaceRolePermissions(Long roleId, List<Long> permissionIds) {
        Role role = findRole(roleId);
        role.getPermissions().clear();
        role.getPermissions().addAll(resolvePermissions(permissionIds));
        return new RoleAccessResponse(roleRepository.save(role));
    }

    private Role findRole(Long roleId) {
        return roleRepository.findById(roleId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy role"));
    }

    private List<Permission> resolvePermissions(List<Long> permissionIds) {
        List<Long> normalizedIds = permissionIds == null
                ? List.of()
                : permissionIds.stream()
                        .filter(Objects::nonNull)
                        .distinct()
                        .toList();
        List<Permission> permissions = permissionRepository.findAllById(normalizedIds);
        if (permissions.size() != normalizedIds.size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Danh sách permission không hợp lệ");
        }
        return permissions;
    }

    private String normalizeRoleName(String name) {
        String normalized = name == null ? "" : name.trim().replaceAll("\\s+", "_").toUpperCase(Locale.ROOT);
        if (normalized.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tên role không được để trống");
        }
        return normalized;
    }

    private String normalizeDescription(String description) {
        return description == null || description.isBlank() ? null : description.trim();
    }
}
