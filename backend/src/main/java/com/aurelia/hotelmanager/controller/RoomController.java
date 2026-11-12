package com.aurelia.hotelmanager.controller;

import com.aurelia.hotelmanager.dto.request.RoomRequest;
import com.aurelia.hotelmanager.dto.response.RoomResponse;
import com.aurelia.hotelmanager.model.RoomPhoto;
import com.aurelia.hotelmanager.repository.RoomPhotoRepository;
import com.aurelia.hotelmanager.service.RoomImageStorageService;
import com.aurelia.hotelmanager.service.RoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/rooms")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_ADMIN') and hasAuthority('ROOM_MANAGE_ROOMS')")
public class RoomController {

    private final RoomService roomService;
    private final RoomPhotoRepository roomPhotoRepository;
    private final RoomImageStorageService roomImageStorageService;

    @GetMapping
    public List<RoomResponse> list() {
        return roomService.list();
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public RoomResponse create(@Valid @ModelAttribute RoomRequest request,
                               @RequestPart(value = "images", required = false) List<MultipartFile> images) {
        return roomService.create(request, images);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        roomService.delete(id);
    }

    @GetMapping("/{roomId}/images/{photoId}")
    public ResponseEntity<Resource> image(@PathVariable Long roomId, @PathVariable Long photoId) {
        RoomPhoto photo = roomPhotoRepository.findByIdAndRoomId(photoId, roomId)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Room image not found"));
        RoomImageStorageService.RoomImageFile image = roomImageStorageService.open(photo);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(image.contentType()))
                .contentLength(image.size())
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
                .header("X-Content-Type-Options", "nosniff")
                .body(new InputStreamResource(image.stream()));
    }
}
