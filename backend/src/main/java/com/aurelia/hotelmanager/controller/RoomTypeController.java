package com.aurelia.hotelmanager.controller;

import com.aurelia.hotelmanager.dto.request.RoomTypeRequest;
import com.aurelia.hotelmanager.dto.response.RoomTypeResponse;
import com.aurelia.hotelmanager.service.RoomTypeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/room-types")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_ADMIN') and hasAuthority('ROLE_MANAGE_ROLES')")
public class RoomTypeController {

    private final RoomTypeService roomTypeService;

    @GetMapping
    public List<RoomTypeResponse> list() {
        return roomTypeService.list();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RoomTypeResponse create(@Valid @RequestBody RoomTypeRequest request) {
        return roomTypeService.create(request);
    }

    @PutMapping("/{id}")
    public RoomTypeResponse update(@PathVariable Long id, @Valid @RequestBody RoomTypeRequest request) {
        return roomTypeService.update(id, request);
    }
}
