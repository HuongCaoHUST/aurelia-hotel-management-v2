package com.aurelia.hotelmanager.dto.response;

import java.time.LocalDateTime;

public record AmenityGroupResponse(
        Long id,
        String name,
        String description,
        Boolean active,
        int amenityCount,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
}
