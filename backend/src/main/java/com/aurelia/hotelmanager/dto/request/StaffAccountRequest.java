package com.aurelia.hotelmanager.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class StaffAccountRequest {

    @NotBlank(message = "Họ tên là bắt buộc")
    private String fullName;

    @NotBlank(message = "Email là bắt buộc")
    @Email(message = "Email không hợp lệ")
    private String email;

    private String department;

    @NotBlank(message = "Vai trò là bắt buộc")
    private String roleName;

    @NotBlank(message = "Mật khẩu là bắt buộc")
    @Size(min = 8, max = 72, message = "Mật khẩu phải dài từ 8 đến 72 ký tự")
    private String password;
}
