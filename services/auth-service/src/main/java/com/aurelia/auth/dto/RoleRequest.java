package com.aurelia.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.util.Set;

@Data
public class RoleRequest {
    @NotBlank @Size(max = 80)
    private String name;
    @Size(max = 255)
    private String description;
    private Set<Long> permissionIds = Set.of();
}
