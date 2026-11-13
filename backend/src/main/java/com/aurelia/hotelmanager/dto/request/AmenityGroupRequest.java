package com.aurelia.hotelmanager.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AmenityGroupRequest {

    @NotBlank
    @Size(max = 120)
    private String name;

    @Size(max = 500)
    private String description;

    @NotNull
    private Boolean active = true;
}
