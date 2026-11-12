package com.aurelia.hotelmanager.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record RoleUpsertRequest(
        @NotBlank(message = "Tên role không được để trống")
        @Size(max = 80, message = "Tên role không được vượt quá 80 ký tự")
        String name,
        @Size(max = 500, message = "Mô tả không được vượt quá 500 ký tự")
        String description,
        List<Long> permissionIds
) {
}
