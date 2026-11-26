package com.aurelia.aurelia_hotel_management.domain.entity;

import com.aurelia.aurelia_hotel_management.domain.enums.*;
import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "rooms", indexes = {@Index(name = "idx_rooms_occupancy_status", columnList = "occupancy_status"), @Index(name = "idx_rooms_housekeeping_status", columnList = "housekeeping_status"), @Index(name = "idx_rooms_operational_status", columnList = "operational_status")})
@Getter @Setter @NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Room extends BaseEntity {
    @Version private Long version;
    @Column(name = "room_number", nullable = false, unique = true, length = 20) private String roomNumber;
    @Column(nullable = false) private Integer floor;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "room_type_id", nullable = false, foreignKey = @ForeignKey(name = "fk_rooms_room_type")) @ToString.Exclude private RoomType roomType;
    @Enumerated(EnumType.STRING) @Column(name = "occupancy_status", nullable = false, length = 20) private OccupancyStatus occupancyStatus = OccupancyStatus.VACANT;
    @Enumerated(EnumType.STRING) @Column(name = "housekeeping_status", nullable = false, length = 20) private HousekeepingStatus housekeepingStatus = HousekeepingStatus.DIRTY;
    @Enumerated(EnumType.STRING) @Column(name = "operational_status", nullable = false, length = 30) private OperationalStatus operationalStatus = OperationalStatus.AVAILABLE;
    @Column(columnDefinition = "text") private String description;
}
