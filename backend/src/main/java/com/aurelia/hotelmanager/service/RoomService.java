package com.aurelia.hotelmanager.service;

import com.aurelia.hotelmanager.dto.request.RoomRequest;
import com.aurelia.hotelmanager.dto.response.RoomPhotoResponse;
import com.aurelia.hotelmanager.dto.response.RoomResponse;
import com.aurelia.hotelmanager.model.Room;
import com.aurelia.hotelmanager.model.RoomPhoto;
import com.aurelia.hotelmanager.model.RoomStatus;
import com.aurelia.hotelmanager.model.RoomType;
import com.aurelia.hotelmanager.repository.RoomRepository;
import com.aurelia.hotelmanager.repository.RoomTypeRepository;
import com.aurelia.hotelmanager.repository.ReservationRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoomService {

    private static final int MAX_IMAGES_PER_ROOM = 10;

    private final RoomRepository roomRepository;
    private final RoomTypeRepository roomTypeRepository;
    private final ReservationRoomRepository reservationRoomRepository;
    private final RoomImageStorageService roomImageStorageService;

    public List<RoomResponse> list() {
        return roomRepository.findAllByOrderByRoomType_NameAscRoomNumberAsc().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public RoomResponse create(RoomRequest request, List<MultipartFile> images) {
        String roomNumber = normalizeRoomNumber(request.getRoomNumber());
        if (roomRepository.existsByRoomNumber(roomNumber)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Room number already exists");
        }

        RoomType roomType = roomTypeRepository.findById(request.getRoomTypeId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Room type not found"));
        List<MultipartFile> validImages = images == null
                ? List.of()
                : images.stream().filter(file -> file != null && !file.isEmpty()).toList();
        if (validImages.size() > MAX_IMAGES_PER_ROOM) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "A room can have up to " + MAX_IMAGES_PER_ROOM + " images");
        }

        Room room = Room.builder()
                .roomNumber(roomNumber)
                .floor(request.getFloor())
                .roomType(roomType)
                .status(request.getStatus() == null ? RoomStatus.AVAILABLE : request.getStatus())
                .notes(normalizeOptional(request.getNotes()))
                .build();
        Room savedRoom = roomRepository.save(room);
        List<String> uploadedKeys = new ArrayList<>();

        try {
            for (int index = 0; index < validImages.size(); index++) {
                RoomImageStorageService.StoredImage stored = roomImageStorageService
                        .upload(savedRoom, validImages.get(index));
                uploadedKeys.add(stored.objectKey());
                savedRoom.getPhotos().add(RoomPhoto.builder()
                        .room(savedRoom)
                        .objectKey(stored.objectKey())
                        .contentType(stored.contentType())
                        .originalFilename(stored.originalFilename())
                        .fileSize(stored.fileSize())
                        .displayOrder(index)
                        .build());
            }
            return toResponse(roomRepository.save(savedRoom));
        } catch (RuntimeException exception) {
            uploadedKeys.forEach(roomImageStorageService::delete);
            throw exception;
        }
    }

    @Transactional
    public void delete(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Room not found"));
        if (reservationRoomRepository.existsByRoomId(id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Room is linked to a reservation and cannot be deleted");
        }

        List<String> objectKeys = room.getPhotos().stream()
                .map(RoomPhoto::getObjectKey)
                .toList();
        roomRepository.delete(room);
        roomRepository.flush();
        objectKeys.forEach(roomImageStorageService::delete);
    }

    private RoomResponse toResponse(Room room) {
        List<RoomPhotoResponse> photos = room.getPhotos().stream()
                .sorted(Comparator.comparing(RoomPhoto::getDisplayOrder))
                .map(photo -> new RoomPhotoResponse(
                        photo.getId(),
                        photo.getOriginalFilename(),
                        photo.getContentType(),
                        photo.getFileSize(),
                        "/rooms/" + room.getId() + "/images/" + photo.getId(),
                        photo.getDisplayOrder()))
                .toList();
        return new RoomResponse(
                room.getId(),
                room.getRoomNumber(),
                room.getFloor(),
                room.getStatus(),
                room.getNotes(),
                room.getRoomType().getId(),
                room.getRoomType().getName(),
                photos,
                room.getCreatedAt(),
                room.getUpdatedAt());
    }

    private String normalizeRoomNumber(String value) {
        return value.trim().replaceAll("\\s+", "").toUpperCase(Locale.ROOT);
    }

    private String normalizeOptional(String value) {
        if (value == null) return null;
        String normalized = value.trim();
        return normalized.isEmpty() ? null : normalized;
    }
}
