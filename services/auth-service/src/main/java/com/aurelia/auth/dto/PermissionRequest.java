package com.aurelia.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PermissionRequest {
    @NotBlank @Size(max = 120)
    private String code;
    @Size(max = 255)
    private String description;
}
