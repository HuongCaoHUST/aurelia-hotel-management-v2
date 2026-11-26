package com.aurelia.aurelia_hotel_management.domain.repository;
import com.aurelia.aurelia_hotel_management.domain.entity.Equipment; import org.springframework.data.jpa.repository.JpaRepository; import java.util.UUID;
public interface EquipmentRepository extends JpaRepository<Equipment, UUID> { }
