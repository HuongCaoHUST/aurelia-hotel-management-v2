package com.aurelia.hotelmanager.dto.response;

import com.aurelia.hotelmanager.model.Permission;

public record PermissionAccessResponse(
        Long id,
        String code,
        String name,
        String description
) {
    public PermissionAccessResponse(Permission permission) {
        this(permission.getId(), permission.getCode(), permission.getName(), permission.getDescription());
    }
}
