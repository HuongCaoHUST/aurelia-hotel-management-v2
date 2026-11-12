package com.aurelia.hotelmanager.service;

import com.aurelia.hotelmanager.dto.request.RoomTypeRequest;
import com.aurelia.hotelmanager.dto.response.RoomTypeResponse;
import com.aurelia.hotelmanager.model.RoomType;
import com.aurelia.hotelmanager.model.RoomTypeStatus;
import com.aurelia.hotelmanager.repository.RoomTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoomTypeService {

    private final RoomTypeRepository roomTypeRepository;

    public List<RoomTypeResponse> list() {
        return roomTypeRepository.findAll(Sort.by(Sort.Direction.ASC, "name")).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public RoomTypeResponse create(RoomTypeRequest request) {
        String name = normalizeName(request.getName());
        boolean duplicate = roomTypeRepository.findAll().stream()
                .anyMatch(existing -> existing.getName().equalsIgnoreCase(name));
        if (duplicate) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Tên hạng phòng đã tồn tại");
        }

        RoomType roomType = RoomType.builder()
                .name(name)
                .description(normalizeOptional(request.getDescription()))
                .basePrice(request.getBasePrice())
                .maxOccupancy(request.getMaxOccupancy())
                .sizeInSquareMeters(request.getSizeInSquareMeters())
                .bedType(normalizeOptional(request.getBedType()))
                .status(RoomTypeStatus.ACTIVE)
                .build();

        return toResponse(roomTypeRepository.save(roomType));
    }

    @Transactional
    public RoomTypeResponse update(Long id, RoomTypeRequest request) {
        RoomType roomType = roomTypeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Room type not found"));
        String name = normalizeName(request.getName());
        if (roomTypeRepository.existsByNameIgnoreCaseAndIdNot(name, id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Room type name already exists");
        }

        roomType.setName(name);
        roomType.setDescription(normalizeOptional(request.getDescription()));
        roomType.setBasePrice(request.getBasePrice());
        roomType.setMaxOccupancy(request.getMaxOccupancy());
        roomType.setSizeInSquareMeters(request.getSizeInSquareMeters());
        roomType.setBedType(normalizeOptional(request.getBedType()));
        return toResponse(roomTypeRepository.save(roomType));
    }

    private RoomTypeResponse toResponse(RoomType roomType) {
        return new RoomTypeResponse(
                roomType.getId(),
                roomType.getName(),
                roomType.getDescription(),
                roomType.getBasePrice(),
                roomType.getMaxOccupancy(),
                roomType.getSizeInSquareMeters(),
                roomType.getBedType(),
                roomType.getStatus(),
                roomType.getRooms().size(),
                roomType.getCreatedAt(),
                roomType.getUpdatedAt());
    }

    private String normalizeName(String value) {
        return value.trim().replaceAll("\\s+", " ");
    }

    private String normalizeOptional(String value) {
        if (value == null) return null;
        String normalized = value.trim();
        return normalized.isEmpty() ? null : normalized;
    }
}
