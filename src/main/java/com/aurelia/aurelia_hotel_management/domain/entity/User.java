package com.aurelia.aurelia_hotel_management.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "users", indexes = {@Index(name = "idx_users_email", columnList = "email")})
@Getter @Setter @NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User extends BaseEntity {
    @Column(nullable = false, unique = true, length = 320) private String email;
    @Column(nullable = false, length = 120) private String fullName;
    @Column(length = 30) private String phone;
    @Column(nullable = false) private boolean enabled = true;
}
