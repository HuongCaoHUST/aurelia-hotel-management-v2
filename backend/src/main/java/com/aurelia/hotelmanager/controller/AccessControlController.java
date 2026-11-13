package com.aurelia.hotelmanager.controller;

import com.aurelia.hotelmanager.dto.request.RoleUpsertRequest;
import com.aurelia.hotelmanager.dto.request.RolePermissionsUpdateRequest;
import com.aurelia.hotelmanager.dto.response.PermissionAccessResponse;
import com.aurelia.hotelmanager.dto.response.RoleAccessResponse;
import com.aurelia.hotelmanager.service.AccessControlService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class AccessControlController {

    private final AccessControlService accessControlService;

    @GetMapping("/roles")
    @PreAuthorize("hasAnyAuthority('ROLE_MANAGE_ROLES', 'ROLE_MANAGE_PERMISSIONS')")
    public List<RoleAccessResponse> listRoles() {
        return accessControlService.listRoles();
    }

    @GetMapping("/permissions")
    @PreAuthorize("hasAnyAuthority('ROLE_MANAGE_ROLES', 'ROLE_MANAGE_PERMISSIONS')")
    public List<PermissionAccessResponse> listPermissions() {
        return accessControlService.listPermissions();
    }

    @PostMapping("/roles")
    @PreAuthorize("hasAuthority('ROLE_CREATE')")
    public RoleAccessResponse createRole(@Valid @RequestBody RoleUpsertRequest request) {
        return accessControlService.createRole(request.name(), request.description(), request.permissionIds());
    }

    @PutMapping("/roles/{roleId}")
    @PreAuthorize("hasAuthority('ROLE_UPDATE')")
    public RoleAccessResponse updateRole(
            @PathVariable Long roleId,
            @Valid @RequestBody RoleUpsertRequest request) {
        return accessControlService.updateRole(roleId, request.name(), request.description(), request.permissionIds());
    }

    @DeleteMapping("/roles/{roleId}")
    @PreAuthorize("hasAuthority('ROLE_DELETE')")
    public void deleteRole(@PathVariable Long roleId) {
        accessControlService.deleteRole(roleId);
    }

    @PutMapping("/roles/{roleId}/permissions")
    @PreAuthorize("hasAuthority('ROLE_MANAGE_PERMISSIONS')")
    public RoleAccessResponse replaceRolePermissions(
            @PathVariable Long roleId,
            @Valid @RequestBody RolePermissionsUpdateRequest request) {
        return accessControlService.replaceRolePermissions(roleId, request.permissionIds());
    }
}
