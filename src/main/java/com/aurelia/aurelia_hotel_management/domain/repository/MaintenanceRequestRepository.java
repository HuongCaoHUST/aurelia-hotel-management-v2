package com.aurelia.aurelia_hotel_management.domain.repository;
import com.aurelia.aurelia_hotel_management.domain.entity.MaintenanceRequest; import org.springframework.data.jpa.repository.JpaRepository; import java.util.UUID;
public interface MaintenanceRequestRepository extends JpaRepository<MaintenanceRequest, UUID> { }
