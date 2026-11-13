package com.aurelia.hotelmanager.service;

import com.aurelia.hotelmanager.dto.request.AmenityGroupRequest;
import com.aurelia.hotelmanager.dto.request.AmenityRequest;
import com.aurelia.hotelmanager.dto.response.AmenityGroupResponse;
import com.aurelia.hotelmanager.dto.response.AmenityResponse;
import com.aurelia.hotelmanager.model.Amenity;
import com.aurelia.hotelmanager.model.AmenityGroup;
import com.aurelia.hotelmanager.model.AmenityStatus;
import com.aurelia.hotelmanager.repository.AmenityGroupRepository;
import com.aurelia.hotelmanager.repository.AmenityRepository;
import com.aurelia.hotelmanager.repository.RoomTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AmenityService {

    private final AmenityGroupRepository amenityGroupRepository;
    private final AmenityRepository amenityRepository;
    private final RoomTypeRepository roomTypeRepository;

    public List<AmenityGroupResponse> listGroups() {
        return amenityGroupRepository.findAll().stream()
                .sorted(Comparator.comparing(AmenityGroup::getName, String.CASE_INSENSITIVE_ORDER))
                .map(this::toGroupResponse)
                .toList();
    }

    public List<AmenityResponse> listAmenities() {
        return amenityRepository.findAll().stream()
                .sorted(Comparator.comparing((Amenity amenity) -> amenity.getGroup().getName(), String.CASE_INSENSITIVE_ORDER)
                        .thenComparing(Amenity::getName, String.CASE_INSENSITIVE_ORDER))
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public AmenityGroupResponse createGroup(AmenityGroupRequest request) {
        String name = normalizeRequired(request.getName(), "Tên nhóm tiện ích không được để trống");
        if (amenityGroupRepository.existsByNameIgnoreCase(name)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Nhóm tiện ích đã tồn tại");
        }
        AmenityGroup group = AmenityGroup.builder()
                .name(name)
                .description(normalizeOptional(request.getDescription()))
                .active(request.getActive() == null || request.getActive())
                .build();
        return toGroupResponse(amenityGroupRepository.save(group));
    }

    @Transactional
    public AmenityGroupResponse updateGroup(Long id, AmenityGroupRequest request) {
        AmenityGroup group = findGroup(id);
        String name = normalizeRequired(request.getName(), "Tên nhóm tiện ích không được để trống");
        if (amenityGroupRepository.existsByNameIgnoreCaseAndIdNot(name, id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Nhóm tiện ích đã tồn tại");
        }
        group.setName(name);
        group.setDescription(normalizeOptional(request.getDescription()));
        group.setActive(request.getActive() == null || request.getActive());
        return toGroupResponse(amenityGroupRepository.save(group));
    }

    @Transactional
    public void deleteGroup(Long id) {
        AmenityGroup group = findGroup(id);
        if (amenityRepository.existsByGroupId(id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Không thể xóa nhóm đang chứa tiện ích");
        }
        amenityGroupRepository.delete(group);
    }

    @Transactional
    public AmenityResponse createAmenity(AmenityRequest request) {
        AmenityGroup group = findGroup(request.getGroupId());
        String name = normalizeRequired(request.getName(), "Tên tiện ích không được để trống");
        if (amenityRepository.existsByNameIgnoreCaseAndGroupId(name, group.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Tiện ích đã tồn tại trong nhóm này");
        }
        Amenity amenity = Amenity.builder()
                .name(name)
                .icon(normalizeOptional(request.getIcon()))
                .description(normalizeOptional(request.getDescription()))
                .status(request.getStatus() == null ? AmenityStatus.ACTIVE : request.getStatus())
                .group(group)
                .build();
        return toResponse(amenityRepository.save(amenity));
    }

    @Transactional
    public AmenityResponse updateAmenity(Long id, AmenityRequest request) {
        Amenity amenity = findAmenity(id);
        AmenityGroup group = findGroup(request.getGroupId());
        String name = normalizeRequired(request.getName(), "Tên tiện ích không được để trống");
        if (amenityRepository.existsByNameIgnoreCaseAndGroupIdAndIdNot(name, group.getId(), id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Tiện ích đã tồn tại trong nhóm này");
        }
        amenity.setName(name);
        amenity.setIcon(normalizeOptional(request.getIcon()));
        amenity.setDescription(normalizeOptional(request.getDescription()));
        amenity.setStatus(request.getStatus() == null ? AmenityStatus.ACTIVE : request.getStatus());
        amenity.setGroup(group);
        return toResponse(amenityRepository.save(amenity));
    }

    @Transactional
    public void deleteAmenity(Long id) {
        Amenity amenity = findAmenity(id);
        if (roomTypeRepository.existsByAmenities_Id(id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Không thể xóa tiện ích đang được gắn với loại phòng");
        }
        amenityRepository.delete(amenity);
    }

    private AmenityGroup findGroup(Long id) {
        return amenityGroupRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Không tìm thấy nhóm tiện ích"));
    }

    private Amenity findAmenity(Long id) {
        return amenityRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Không tìm thấy tiện ích"));
    }

    private AmenityGroupResponse toGroupResponse(AmenityGroup group) {
        return new AmenityGroupResponse(
                group.getId(),
                group.getName(),
                group.getDescription(),
                group.getActive(),
                group.getAmenities().size(),
                group.getCreatedAt(),
                group.getUpdatedAt());
    }

    private AmenityResponse toResponse(Amenity amenity) {
        return new AmenityResponse(
                amenity.getId(),
                amenity.getName(),
                amenity.getIcon(),
                amenity.getDescription(),
                amenity.getStatus(),
                amenity.getGroup().getId(),
                amenity.getGroup().getName(),
                amenity.getCreatedAt(),
                amenity.getUpdatedAt());
    }

    private String normalizeRequired(String value, String message) {
        String normalized = value == null ? "" : value.trim().replaceAll("\\s+", " ");
        if (normalized.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
        }
        return normalized;
    }

    private String normalizeOptional(String value) {
        if (value == null) return null;
        String normalized = value.trim();
        return normalized.isEmpty() ? null : normalized;
    }
}
