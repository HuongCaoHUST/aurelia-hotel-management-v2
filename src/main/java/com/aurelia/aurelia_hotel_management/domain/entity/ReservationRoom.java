package com.aurelia.aurelia_hotel_management.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity @Table(name = "reservation_rooms", uniqueConstraints = @UniqueConstraint(name = "uk_reservation_room", columnNames = {"reservation_id", "room_id"}), indexes = @Index(name = "idx_reservation_rooms_room", columnList = "room_id"))
@Getter @Setter @NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ReservationRoom extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "reservation_id", nullable = false, foreignKey = @ForeignKey(name = "fk_reservation_rooms_reservation")) @ToString.Exclude private Reservation reservation;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "room_id", nullable = false, foreignKey = @ForeignKey(name = "fk_reservation_rooms_room")) @ToString.Exclude private Room room;
    @Column(name = "price_per_night", nullable = false, precision = 19, scale = 2) private BigDecimal pricePerNight;
    @Column(name = "number_of_nights", nullable = false) private Integer numberOfNights;
    @Column(nullable = false, precision = 19, scale = 2) private BigDecimal subtotal;
}
