package com.aurelia.aurelia_hotel_management.domain.entity;

import com.aurelia.aurelia_hotel_management.domain.enums.EquipmentStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name = "room_equipment", uniqueConstraints = @UniqueConstraint(name = "uk_room_equipment", columnNames = {"room_id", "equipment_id"}), indexes = @Index(name = "idx_room_equipment_equipment", columnList = "equipment_id"))
@Getter @Setter @NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RoomEquipment extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "room_id", nullable = false, foreignKey = @ForeignKey(name = "fk_room_equipment_room")) @ToString.Exclude private Room room;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "equipment_id", nullable = false, foreignKey = @ForeignKey(name = "fk_room_equipment_equipment")) @ToString.Exclude private Equipment equipment;
    @Column(nullable = false) private Integer quantity = 1;
    @Column(name = "installed_at") private LocalDateTime installedAt;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 30) private EquipmentStatus status = EquipmentStatus.NORMAL;
    @Column(columnDefinition = "text") private String notes;
}
