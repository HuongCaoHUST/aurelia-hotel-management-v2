package com.aurelia.hotelmanager.dto.response;

import com.aurelia.hotelmanager.model.Role;

import java.util.List;

public record RoleAccessResponse(
        Long id,
        String name,
        String description,
        List<PermissionAccessResponse> permissions
) {
    public RoleAccessResponse(Role role) {
        this(
                role.getId(),
                role.getName(),
                role.getDescription(),
                role.getPermissions().stream()
                        .map(PermissionAccessResponse::new)
                        .toList()
        );
    }
}
