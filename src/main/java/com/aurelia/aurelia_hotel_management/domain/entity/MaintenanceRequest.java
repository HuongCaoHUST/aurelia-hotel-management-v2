package com.aurelia.aurelia_hotel_management.domain.entity;

import com.aurelia.aurelia_hotel_management.domain.enums.*;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name = "maintenance_requests", indexes = {@Index(name = "idx_maintenance_requests_status", columnList = "status"), @Index(name = "idx_maintenance_requests_room", columnList = "room_id"), @Index(name = "idx_maintenance_requests_equipment", columnList = "equipment_id")})
@Getter @Setter @NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MaintenanceRequest extends BaseEntity {
    @Version private Long version;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "room_id", foreignKey = @ForeignKey(name = "fk_maintenance_requests_room")) @ToString.Exclude private Room room;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "equipment_id", foreignKey = @ForeignKey(name = "fk_maintenance_requests_equipment")) @ToString.Exclude private Equipment equipment;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "reported_by_id", nullable = false, foreignKey = @ForeignKey(name = "fk_maintenance_requests_reported_by")) @ToString.Exclude private User reportedBy;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "assigned_to_id", foreignKey = @ForeignKey(name = "fk_maintenance_requests_assigned_to")) @ToString.Exclude private User assignedTo;
    @Column(nullable = false, length = 200) private String title;
    @Column(nullable = false, columnDefinition = "text") private String description;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private Priority priority = Priority.NORMAL;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private MaintenanceStatus status = MaintenanceStatus.OPEN;
    @Column(name = "reported_at", nullable = false) private LocalDateTime reportedAt;
    @Column(name = "started_at") private LocalDateTime startedAt;
    @Column(name = "completed_at") private LocalDateTime completedAt;
    @Column(columnDefinition = "text") private String resolution;
}
