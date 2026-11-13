package com.aurelia.hotelmanager.dto.response;

import com.aurelia.hotelmanager.model.AmenityStatus;

import java.time.LocalDateTime;

public record AmenityResponse(
        Long id,
        String name,
        String icon,
        String description,
        AmenityStatus status,
        Long groupId,
        String groupName,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
}
