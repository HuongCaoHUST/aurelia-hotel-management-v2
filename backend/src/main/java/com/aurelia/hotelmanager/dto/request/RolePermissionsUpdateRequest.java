package com.aurelia.hotelmanager.dto.request;

import jakarta.validation.constraints.NotNull;

import java.util.List;

public record RolePermissionsUpdateRequest(
        @NotNull(message = "Danh sách permission không được để trống")
        List<Long> permissionIds
) {
}
