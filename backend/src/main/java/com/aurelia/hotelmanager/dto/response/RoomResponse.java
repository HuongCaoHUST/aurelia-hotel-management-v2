package com.aurelia.hotelmanager.dto.response;

import com.aurelia.hotelmanager.model.RoomStatus;

import java.time.LocalDateTime;
import java.util.List;

public record RoomResponse(
        Long id,
        String roomNumber,
        Integer floor,
        RoomStatus status,
        String notes,
        Long roomTypeId,
        String roomTypeName,
        List<RoomPhotoResponse> photos,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
}
