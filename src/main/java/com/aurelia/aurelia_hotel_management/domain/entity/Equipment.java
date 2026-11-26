package com.aurelia.aurelia_hotel_management.domain.entity;

import com.aurelia.aurelia_hotel_management.domain.enums.EquipmentStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity @Table(name = "equipment", indexes = @Index(name = "idx_equipment_serial_number", columnList = "serial_number"))
@Getter @Setter @NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Equipment extends BaseEntity {
    @Column(nullable = false, length = 150) private String name;
    @Column(length = 100) private String category;
    @Column(length = 100) private String manufacturer;
    @Column(length = 100) private String model;
    @Column(name = "serial_number", unique = true, length = 150) private String serialNumber;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 30) private EquipmentStatus status = EquipmentStatus.NORMAL;
    @Column(name = "purchase_date") private LocalDate purchaseDate;
    @Column(name = "warranty_expiration_date") private LocalDate warrantyExpirationDate;
}
