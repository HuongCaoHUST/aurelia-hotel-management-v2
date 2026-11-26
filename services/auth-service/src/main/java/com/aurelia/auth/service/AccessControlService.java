package com.aurelia.auth.service;

import com.aurelia.auth.dto.*;
import com.aurelia.auth.entity.Permission;
import com.aurelia.auth.entity.Role;
import com.aurelia.auth.repository.PermissionRepository;
import com.aurelia.auth.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AccessControlService {
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    @Transactional(readOnly = true)
    public List<RoleResponse> roles() {
        return roleRepository.findAll().stream().map(this::toRoleResponse).toList();
    }

    public RoleResponse createRole(RoleRequest request) {
        if (roleRepository.findByName(request.getName()).isPresent()) throw new IllegalArgumentException("Role already exists");
        Role role = Role.builder().name(request.getName().trim()).description(request.getDescription()).build();
        role.getPermissions().addAll(permissionRepository.findAllById(request.getPermissionIds()));
        return toRoleResponse(roleRepository.save(role));
    }

    public RoleResponse updateRole(Long id, RoleRequest request) {
        Role role = roleRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Role not found"));
        role.setName(request.getName().trim());
        role.setDescription(request.getDescription());
        role.getPermissions().clear();
        role.getPermissions().addAll(permissionRepository.findAllById(request.getPermissionIds()));
        return toRoleResponse(role);
    }

    public void deleteRole(Long id) { roleRepository.deleteById(id); }

    @Transactional(readOnly = true)
    public List<PermissionResponse> permissions() {
        return permissionRepository.findAll().stream().map(this::toPermissionResponse).toList();
    }

    public PermissionResponse createPermission(PermissionRequest request) {
        if (permissionRepository.findByCode(request.getCode()).isPresent()) throw new IllegalArgumentException("Permission already exists");
        return toPermissionResponse(permissionRepository.save(Permission.builder()
                .code(request.getCode().trim()).description(request.getDescription()).build()));
    }

    public PermissionResponse updatePermission(Long id, PermissionRequest request) {
        Permission permission = permissionRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Permission not found"));
        permission.setCode(request.getCode().trim());
        permission.setDescription(request.getDescription());
        return toPermissionResponse(permission);
    }

    public void deletePermission(Long id) { permissionRepository.deleteById(id); }

    private PermissionResponse toPermissionResponse(Permission p) {
        return PermissionResponse.builder().id(p.getId()).code(p.getCode()).description(p.getDescription()).build();
    }

    private RoleResponse toRoleResponse(Role role) {
        return RoleResponse.builder().id(role.getId()).name(role.getName()).description(role.getDescription())
                .permissions(role.getPermissions().stream().map(this::toPermissionResponse).collect(Collectors.toSet())).build();
    }
}
