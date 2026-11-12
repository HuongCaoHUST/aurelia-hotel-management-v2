package com.aurelia.hotelmanager.dto.response;

import com.aurelia.hotelmanager.model.AccountStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class StaffAccountResponse {
    private Long id;
    private String fullName;
    private String firstName;
    private String lastName;
    private String email;
    private String department;
    private AccountStatus status;
    private boolean enabled;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<RoleSummaryResponse> roles;
    private String avatarUrl;

    @Data
    @AllArgsConstructor
    public static class RoleSummaryResponse {
        private Long id;
        private String name;
    }
}
