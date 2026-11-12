package com.aurelia.hotelmanager.repository;

import com.aurelia.hotelmanager.model.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoomTypeRepository extends JpaRepository<RoomType, Long>, JpaSpecificationExecutor<RoomType> {

    Optional<RoomType> findByName(String name);

    boolean existsByName(String name);

    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);
}
