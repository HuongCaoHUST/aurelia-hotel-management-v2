package com.aurelia.hotelmanager.dto.response;

import com.aurelia.hotelmanager.model.RoomTypeStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record RoomTypeResponse(
        Long id,
        String name,
        String description,
        BigDecimal basePrice,
        Integer maxOccupancy,
        Integer sizeInSquareMeters,
        String bedType,
        RoomTypeStatus status,
        int roomCount,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
}
