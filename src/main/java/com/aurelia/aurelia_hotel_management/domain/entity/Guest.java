package com.aurelia.aurelia_hotel_management.domain.entity;

import com.aurelia.aurelia_hotel_management.domain.enums.IdentificationType;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity @Table(name = "guests", indexes = {@Index(name = "idx_guests_email", columnList = "email"), @Index(name = "idx_guests_phone", columnList = "phone")})
@Getter @Setter @NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Guest extends BaseEntity {
    @OneToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id", unique = true, foreignKey = @ForeignKey(name = "fk_guests_user")) private User user;
    @Column(name = "full_name", nullable = false, length = 120) private String fullName;
    @Column(length = 320) private String email;
    @Column(length = 30) private String phone;
    private LocalDate dateOfBirth;
    @Column(length = 80) private String nationality;
    @Enumerated(EnumType.STRING) @Column(length = 30) private IdentificationType identificationType;
    @Column(length = 100) private String identificationNumber;
    @Column(length = 500) private String address;
}
