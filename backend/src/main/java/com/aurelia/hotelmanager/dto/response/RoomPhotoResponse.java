package com.aurelia.hotelmanager.dto.response;

public record RoomPhotoResponse(
        Long id,
        String originalFilename,
        String contentType,
        Long fileSize,
        String imageUrl,
        Integer displayOrder) {
}
