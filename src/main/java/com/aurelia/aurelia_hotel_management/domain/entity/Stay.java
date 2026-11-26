package com.aurelia.aurelia_hotel_management.domain.entity;

import com.aurelia.aurelia_hotel_management.domain.enums.StayStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name = "stays", indexes = {@Index(name = "idx_stays_reservation", columnList = "reservation_id"), @Index(name = "idx_stays_room", columnList = "room_id")})
@Getter @Setter @NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Stay extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "reservation_id", nullable = false, foreignKey = @ForeignKey(name = "fk_stays_reservation")) @ToString.Exclude private Reservation reservation;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "guest_id", nullable = false, foreignKey = @ForeignKey(name = "fk_stays_guest")) @ToString.Exclude private Guest guest;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "room_id", nullable = false, foreignKey = @ForeignKey(name = "fk_stays_room")) @ToString.Exclude private Room room;
    @Column(name = "actual_check_in_time", nullable = false) private LocalDateTime actualCheckInTime;
    @Column(name = "actual_check_out_time") private LocalDateTime actualCheckOutTime;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 30) private StayStatus status = StayStatus.CHECKED_IN;
    @Column(columnDefinition = "text") private String notes;
}
