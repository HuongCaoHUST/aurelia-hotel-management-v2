package com.aurelia.hotelmanager.repository;

import com.aurelia.hotelmanager.model.Amenity;
import com.aurelia.hotelmanager.model.AmenityStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AmenityRepository extends JpaRepository<Amenity, Long>, JpaSpecificationExecutor<Amenity> {

    List<Amenity> findAllByStatus(AmenityStatus status);

    List<Amenity> findAllByGroupId(Long groupId);

    boolean existsByNameAndGroupId(String name, Long groupId);
}
