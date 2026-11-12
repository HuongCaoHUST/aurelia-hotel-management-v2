package com.aurelia.hotelmanager.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class RoomTypeRequest {

    @NotBlank
    @Size(max = 120)
    private String name;

    @Size(max = 1500)
    private String description;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = true)
    private BigDecimal basePrice;

    @NotNull
    @Min(1)
    private Integer maxOccupancy;

    @Min(1)
    private Integer sizeInSquareMeters;

    @Size(max = 80)
    private String bedType;
}
