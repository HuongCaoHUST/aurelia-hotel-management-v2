package com.aurelia.hotelmanager.controller;

import com.aurelia.hotelmanager.dto.request.StaffAccountRequest;
import com.aurelia.hotelmanager.dto.request.StaffAccountUpdateRequest;
import com.aurelia.hotelmanager.dto.response.AvatarResponse;
import com.aurelia.hotelmanager.dto.response.StaffAccountResponse;
import com.aurelia.hotelmanager.model.User;
import com.aurelia.hotelmanager.repository.UserRepository;
import com.aurelia.hotelmanager.service.AvatarStorageService;
import com.aurelia.hotelmanager.service.StaffAccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/auth/staff")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_MANAGE_ROLES')")
public class StaffAccountController {

    private final StaffAccountService staffAccountService;
    private final UserRepository userRepository;
    private final AvatarStorageService avatarStorageService;

    @GetMapping
    public List<StaffAccountResponse> list() {
        return staffAccountService.list();
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public StaffAccountResponse create(@Valid @RequestBody StaffAccountRequest request) {
        return staffAccountService.create(request);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public StaffAccountResponse createWithAvatar(
            @Valid @ModelAttribute StaffAccountRequest request,
            @RequestPart(value = "avatar", required = false) MultipartFile avatar) {
        return staffAccountService.create(request, avatar);
    }

    @PutMapping("/{id}")
    public StaffAccountResponse update(@PathVariable Long id,
                                       @Valid @RequestBody StaffAccountUpdateRequest request) {
        return staffAccountService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('ROLE_ADMIN') and hasAuthority('STAFF_DELETE')")
    public void delete(@PathVariable Long id) {
        staffAccountService.delete(id);
    }

    @PostMapping(value = "/{id}/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public AvatarResponse uploadAvatar(@PathVariable Long id,
                                       @RequestPart("file") MultipartFile file) {
        User user = findUser(id);
        return avatarStorageService.upload(user, file, "/auth/staff/" + id + "/avatar");
    }

    @GetMapping("/{id}/avatar")
    public ResponseEntity<Resource> downloadAvatar(@PathVariable Long id) {
        return AvatarController.toResponse(avatarStorageService.open(findUser(id)));
    }

    @DeleteMapping("/{id}/avatar")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAvatar(@PathVariable Long id) {
        avatarStorageService.delete(findUser(id));
    }

    private User findUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Không tìm thấy tài khoản nhân viên"));
    }
}
