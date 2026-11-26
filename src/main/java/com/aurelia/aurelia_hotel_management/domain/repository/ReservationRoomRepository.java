package com.aurelia.aurelia_hotel_management.domain.repository;
import com.aurelia.aurelia_hotel_management.domain.entity.ReservationRoom; import com.aurelia.aurelia_hotel_management.domain.enums.ReservationStatus; import org.springframework.data.jpa.repository.*; import org.springframework.data.repository.query.Param; import java.time.LocalDate; import java.util.*;
public interface ReservationRoomRepository extends JpaRepository<ReservationRoom, UUID> {
    @Query("select count(rr) > 0 from ReservationRoom rr where rr.room.id = :roomId and rr.reservation.status in :statuses and rr.reservation.checkInDate < :checkOut and rr.reservation.checkOutDate > :checkIn")
    boolean existsActiveOverlap(@Param("roomId") UUID roomId, @Param("checkIn") LocalDate checkIn, @Param("checkOut") LocalDate checkOut, @Param("statuses") Collection<ReservationStatus> statuses);
}
