package com.aurelia.aurelia_hotel_management.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "audit_logs", indexes = {@Index(name = "idx_audit_logs_entity", columnList = "entity_type,entity_id"), @Index(name = "idx_audit_logs_user_created", columnList = "user_id,created_at")})
@Getter @Setter @NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AuditLog extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id", foreignKey = @ForeignKey(name = "fk_audit_logs_user")) @ToString.Exclude private User user;
    @Column(nullable = false, length = 100) private String action;
    @Column(name = "entity_type", nullable = false, length = 100) private String entityType;
    @Column(name = "entity_id", nullable = false, length = 36) private String entityId;
    @Column(name = "old_value", columnDefinition = "json") private String oldValue;
    @Column(name = "new_value", columnDefinition = "json") private String newValue;
    @Column(name = "ip_address", length = 45) private String ipAddress;
}
