package com.aurelia.aurelia_hotel_management.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity @Table(name = "room_types") @Getter @Setter @NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RoomType extends BaseEntity {
    @Column(nullable = false, unique = true, length = 100) private String name;
    @Column(columnDefinition = "text") private String description;
    @Column(nullable = false) private Integer capacity;
    @Column(name = "base_price", nullable = false, precision = 19, scale = 2) private BigDecimal basePrice;
    @Column(name = "size_sqm", precision = 8, scale = 2) private BigDecimal size;
    @Column(name = "number_of_beds", nullable = false) private Integer numberOfBeds;
    @Column(name = "bed_type", length = 80) private String bedType;
    @Column(columnDefinition = "json") private String amenities;
}
