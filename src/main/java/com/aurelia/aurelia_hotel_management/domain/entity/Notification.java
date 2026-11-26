package com.aurelia.aurelia_hotel_management.domain.entity;

import com.aurelia.aurelia_hotel_management.domain.enums.NotificationStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name = "notifications", indexes = @Index(name = "idx_notifications_user_status", columnList = "user_id,status"))
@Getter @Setter @NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Notification extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_notifications_user")) @ToString.Exclude private User user;
    @Column(nullable = false, length = 80) private String type;
    @Column(nullable = false, length = 200) private String title;
    @Column(nullable = false, columnDefinition = "text") private String message;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private NotificationStatus status = NotificationStatus.UNREAD;
    @Column(name = "read_at") private LocalDateTime readAt;
}
