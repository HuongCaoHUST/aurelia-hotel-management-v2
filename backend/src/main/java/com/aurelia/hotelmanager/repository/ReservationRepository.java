package com.aurelia.hotelmanager.repository;

import com.aurelia.hotelmanager.model.Reservation;
import com.aurelia.hotelmanager.model.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long>, JpaSpecificationExecutor<Reservation> {

    Optional<Reservation> findByReservationCode(String reservationCode);

    List<Reservation> findAllByStatus(ReservationStatus status);

    List<Reservation> findAllByGuestId(Long guestId);

    List<Reservation> findAllByCheckInDateBetween(LocalDate from, LocalDate to);

    boolean existsByReservationCode(String reservationCode);
}
