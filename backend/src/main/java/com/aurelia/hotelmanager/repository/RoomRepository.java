package com.aurelia.hotelmanager.repository;

import com.aurelia.hotelmanager.model.Room;
import com.aurelia.hotelmanager.model.RoomStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long>, JpaSpecificationExecutor<Room> {

    Optional<Room> findByRoomNumber(String roomNumber);

    List<Room> findAllByStatus(RoomStatus status);

    List<Room> findAllByRoomTypeId(Long roomTypeId);

    boolean existsByRoomNumber(String roomNumber);

    @EntityGraph(attributePaths = {"roomType", "photos"})
    List<Room> findAllByOrderByRoomType_NameAscRoomNumberAsc();
}
