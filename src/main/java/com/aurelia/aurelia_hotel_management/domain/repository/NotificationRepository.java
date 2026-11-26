package com.aurelia.aurelia_hotel_management.domain.repository;
import com.aurelia.aurelia_hotel_management.domain.entity.Notification; import org.springframework.data.jpa.repository.JpaRepository; import java.util.UUID;
public interface NotificationRepository extends JpaRepository<Notification, UUID> { }
