package com.aurelia.aurelia_hotel_management.domain.repository;
import com.aurelia.aurelia_hotel_management.domain.entity.AuditLog; import org.springframework.data.jpa.repository.JpaRepository; import java.util.UUID;
public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> { }
