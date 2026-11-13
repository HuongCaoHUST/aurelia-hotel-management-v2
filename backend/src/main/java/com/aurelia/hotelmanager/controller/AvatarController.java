package com.aurelia.hotelmanager.controller;

import com.aurelia.hotelmanager.dto.response.AvatarResponse;
import com.aurelia.hotelmanager.model.User;
import com.aurelia.hotelmanager.repository.UserRepository;
import com.aurelia.hotelmanager.service.AvatarStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/auth/avatar")
@RequiredArgsConstructor
public class AvatarController {

    private final UserRepository userRepository;
    private final AvatarStorageService avatarStorageService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('ACCOUNT_UPDATE')")
    @ResponseStatus(HttpStatus.CREATED)
    public AvatarResponse upload(@AuthenticationPrincipal UserDetails principal,
                                 @RequestPart("file") MultipartFile file) {
        User user = currentUser(principal);
        return avatarStorageService.upload(user, file, "/auth/avatar");
    }

    @PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('ACCOUNT_UPDATE')")
    public AvatarResponse update(@AuthenticationPrincipal UserDetails principal,
                                 @RequestPart("file") MultipartFile file) {
        User user = currentUser(principal);
        return avatarStorageService.upload(user, file, "/auth/avatar");
    }

    @GetMapping
    public ResponseEntity<Resource> download(@AuthenticationPrincipal UserDetails principal) {
        return toResponse(avatarStorageService.open(currentUser(principal)));
    }

    @DeleteMapping
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('ACCOUNT_UPDATE')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@AuthenticationPrincipal UserDetails principal) {
        avatarStorageService.delete(currentUser(principal));
    }

    private User currentUser(UserDetails principal) {
        return userRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Không tìm thấy tài khoản"));
    }

    static ResponseEntity<Resource> toResponse(AvatarStorageService.AvatarFile avatar) {
        MediaType mediaType = MediaType.parseMediaType(avatar.contentType());
        return ResponseEntity.ok()
                .contentType(mediaType)
                .contentLength(avatar.size())
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
                .header("X-Content-Type-Options", "nosniff")
                .body(new InputStreamResource(avatar.stream()));
    }
}
