package com.aurelia.hotelmanager.dto.request;

import com.aurelia.hotelmanager.model.AmenityStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AmenityRequest {

    @NotBlank
    @Size(max = 120)
    private String name;

    @Size(max = 80)
    private String icon;

    @Size(max = 500)
    private String description;

    @NotNull
    private AmenityStatus status = AmenityStatus.ACTIVE;

    @NotNull
    private Long groupId;
}
