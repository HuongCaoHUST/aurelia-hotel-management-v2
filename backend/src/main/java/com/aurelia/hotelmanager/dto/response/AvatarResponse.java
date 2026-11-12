package com.aurelia.hotelmanager.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AvatarResponse {
    private Long userId;
    private String contentType;
    private long size;
    private String downloadUrl;
}
