package com.aurelia.aurelia_hotel_management.domain.repository;
import com.aurelia.aurelia_hotel_management.domain.entity.HousekeepingTask; import org.springframework.data.jpa.repository.JpaRepository; import java.util.UUID;
public interface HousekeepingTaskRepository extends JpaRepository<HousekeepingTask, UUID> { }
