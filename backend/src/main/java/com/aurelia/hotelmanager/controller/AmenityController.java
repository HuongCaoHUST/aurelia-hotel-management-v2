package com.aurelia.hotelmanager.controller;

import com.aurelia.hotelmanager.dto.request.AmenityGroupRequest;
import com.aurelia.hotelmanager.dto.request.AmenityRequest;
import com.aurelia.hotelmanager.dto.response.AmenityGroupResponse;
import com.aurelia.hotelmanager.dto.response.AmenityResponse;
import com.aurelia.hotelmanager.service.AmenityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/amenities")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_MANAGE_ROLES')")
public class AmenityController {

    private final AmenityService amenityService;

    @GetMapping("/groups")
    public List<AmenityGroupResponse> listGroups() {
        return amenityService.listGroups();
    }

    @PostMapping("/groups")
    @ResponseStatus(HttpStatus.CREATED)
    public AmenityGroupResponse createGroup(@Valid @RequestBody AmenityGroupRequest request) {
        return amenityService.createGroup(request);
    }

    @PutMapping("/groups/{id}")
    public AmenityGroupResponse updateGroup(@PathVariable Long id,
                                            @Valid @RequestBody AmenityGroupRequest request) {
        return amenityService.updateGroup(id, request);
    }

    @DeleteMapping("/groups/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteGroup(@PathVariable Long id) {
        amenityService.deleteGroup(id);
    }

    @GetMapping
    public List<AmenityResponse> listAmenities() {
        return amenityService.listAmenities();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AmenityResponse createAmenity(@Valid @RequestBody AmenityRequest request) {
        return amenityService.createAmenity(request);
    }

    @PutMapping("/{id}")
    public AmenityResponse updateAmenity(@PathVariable Long id,
                                         @Valid @RequestBody AmenityRequest request) {
        return amenityService.updateAmenity(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAmenity(@PathVariable Long id) {
        amenityService.deleteAmenity(id);
    }
}
