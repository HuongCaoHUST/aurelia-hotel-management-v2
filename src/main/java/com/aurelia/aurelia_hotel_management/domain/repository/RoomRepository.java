package com.aurelia.aurelia_hotel_management.domain.repository;
import com.aurelia.aurelia_hotel_management.domain.entity.Room; import org.springframework.data.jpa.repository.*; import org.springframework.data.repository.query.Param; import jakarta.persistence.LockModeType; import java.util.*;
public interface RoomRepository extends JpaRepository<Room, UUID> {
    Optional<Room> findByRoomNumber(String roomNumber);
    @Lock(LockModeType.PESSIMISTIC_WRITE) @Query("select r from Room r where r.id in :ids order by r.id") List<Room> lockAllByIdIn(@Param("ids") Collection<UUID> ids);
}
