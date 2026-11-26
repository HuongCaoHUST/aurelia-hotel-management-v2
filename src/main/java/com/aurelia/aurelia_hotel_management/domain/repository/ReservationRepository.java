package com.aurelia.aurelia_hotel_management.domain.repository;
import com.aurelia.aurelia_hotel_management.domain.entity.Reservation; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface ReservationRepository extends JpaRepository<Reservation, UUID> { Optional<Reservation> findByReservationCode(String reservationCode); }
