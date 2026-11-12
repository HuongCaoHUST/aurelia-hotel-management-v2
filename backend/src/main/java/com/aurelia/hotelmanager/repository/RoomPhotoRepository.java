package com.aurelia.hotelmanager.repository;

import com.aurelia.hotelmanager.model.RoomPhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoomPhotoRepository extends JpaRepository<RoomPhoto, Long> {

    Optional<RoomPhoto> findByIdAndRoomId(Long id, Long roomId);
}
