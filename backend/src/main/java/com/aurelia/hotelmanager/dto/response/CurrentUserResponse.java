package com.aurelia.hotelmanager.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Set;

@Data
@AllArgsConstructor
public class CurrentUserResponse {
    private Long id;
    private String fullName;
    private String firstName;
    private String lastName;
    private String email;
    private Set<String> roles;
    private Set<String> permissions;
}
