package com.aurelia.hotelmanager.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Set;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String fullName;
    private Set<String> roles;
    private Set<String> permissions;
}
