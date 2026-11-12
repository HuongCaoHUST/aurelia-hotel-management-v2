package com.aurelia.hotelmanager.dto.request;

import com.aurelia.hotelmanager.model.AccountStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StaffAccountUpdateRequest {

    @NotBlank(message = "Họ tên là bắt buộc")
    private String fullName;

    @NotBlank(message = "Email là bắt buộc")
    @Email(message = "Email không hợp lệ")
    private String email;

    private String department;

    @NotBlank(message = "Vai trò là bắt buộc")
    private String roleName;

    @NotNull(message = "Trạng thái tài khoản là bắt buộc")
    private Boolean enabled;

    private AccountStatus status;
}
