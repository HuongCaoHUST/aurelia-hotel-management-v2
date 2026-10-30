package com.aurelia.hotelmanager.repository;

import com.aurelia.hotelmanager.model.ReservationRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationRoomRepository extends JpaRepository<ReservationRoom, Long>, JpaSpecificationExecutor<ReservationRoom> {

    List<ReservationRoom> findAllByReservationId(Long reservationId);

    List<ReservationRoom> findAllByRoomId(Long roomId);
}
