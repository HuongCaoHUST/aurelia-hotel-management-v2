package com.aurelia.aurelia_hotel_management.domain.entity;

import com.aurelia.aurelia_hotel_management.domain.enums.*;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name = "housekeeping_tasks", indexes = {@Index(name = "idx_housekeeping_tasks_status", columnList = "status"), @Index(name = "idx_housekeeping_tasks_room", columnList = "room_id"), @Index(name = "idx_housekeeping_tasks_assigned", columnList = "assigned_to_id")})
@Getter @Setter @NoArgsConstructor(access = AccessLevel.PROTECTED)
public class HousekeepingTask extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "room_id", nullable = false, foreignKey = @ForeignKey(name = "fk_housekeeping_tasks_room")) @ToString.Exclude private Room room;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "assigned_to_id", foreignKey = @ForeignKey(name = "fk_housekeeping_tasks_assigned_to")) @ToString.Exclude private User assignedTo;
    @Enumerated(EnumType.STRING) @Column(name = "task_type", nullable = false, length = 30) private TaskType taskType;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private TaskStatus status = TaskStatus.PENDING;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private Priority priority = Priority.NORMAL;
    @Column(name = "assigned_at") private LocalDateTime assignedAt;
    @Column(name = "started_at") private LocalDateTime startedAt;
    @Column(name = "completed_at") private LocalDateTime completedAt;
    @Column(columnDefinition = "text") private String notes;
}
