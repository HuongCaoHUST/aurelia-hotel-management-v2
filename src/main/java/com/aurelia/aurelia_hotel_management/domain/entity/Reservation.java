package com.aurelia.aurelia_hotel_management.domain.entity;

import com.aurelia.aurelia_hotel_management.domain.enums.ReservationStatus;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Entity @Table(name = "reservations", indexes = {@Index(name = "idx_reservations_dates_status", columnList = "check_in_date,check_out_date,status"), @Index(name = "idx_reservations_status", columnList = "status"), @Index(name = "idx_reservations_guest", columnList = "guest_id")})
@Getter @Setter @NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Reservation extends BaseEntity {
    @Version private Long version;
    @Column(name = "reservation_code", nullable = false, unique = true, length = 32) private String reservationCode;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "guest_id", nullable = false, foreignKey = @ForeignKey(name = "fk_reservations_guest")) @ToString.Exclude private Guest guest;
    @Column(name = "check_in_date", nullable = false) private LocalDate checkInDate;
    @Column(name = "check_out_date", nullable = false) private LocalDate checkOutDate;
    @Column(name = "number_of_adults", nullable = false) private Integer numberOfAdults;
    @Column(name = "number_of_children", nullable = false) private Integer numberOfChildren = 0;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private ReservationStatus status = ReservationStatus.PENDING;
    @Column(name = "total_amount", nullable = false, precision = 19, scale = 2) private BigDecimal totalAmount;
    @Column(name = "special_request", columnDefinition = "text") private String specialRequest;
    @OneToMany(mappedBy = "reservation", cascade = CascadeType.PERSIST, orphanRemoval = true) @ToString.Exclude private List<ReservationRoom> reservationRooms = new ArrayList<>();
}
