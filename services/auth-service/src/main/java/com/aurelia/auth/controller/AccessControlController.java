package com.aurelia.auth.controller;

import com.aurelia.auth.dto.*;
import com.aurelia.auth.service.AccessControlService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class AccessControlController {
    private final AccessControlService service;

    @GetMapping("/api/roles") public List<RoleResponse> roles() { return service.roles(); }
    @PostMapping("/api/roles") @ResponseStatus(HttpStatus.CREATED)
    public RoleResponse createRole(@Valid @RequestBody RoleRequest request) { return service.createRole(request); }
    @PutMapping("/api/roles/{id}")
    public RoleResponse updateRole(@PathVariable Long id, @Valid @RequestBody RoleRequest request) { return service.updateRole(id, request); }
    @DeleteMapping("/api/roles/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteRole(@PathVariable Long id) { service.deleteRole(id); }

    @GetMapping("/api/permissions") public List<PermissionResponse> permissions() { return service.permissions(); }
    @PostMapping("/api/permissions") @ResponseStatus(HttpStatus.CREATED)
    public PermissionResponse createPermission(@Valid @RequestBody PermissionRequest request) { return service.createPermission(request); }
    @PutMapping("/api/permissions/{id}")
    public PermissionResponse updatePermission(@PathVariable Long id, @Valid @RequestBody PermissionRequest request) { return service.updatePermission(id, request); }
    @DeleteMapping("/api/permissions/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePermission(@PathVariable Long id) { service.deletePermission(id); }
}
