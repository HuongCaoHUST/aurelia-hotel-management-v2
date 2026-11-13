package com.aurelia.hotelmanager.repository;

import com.aurelia.hotelmanager.model.AmenityGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AmenityGroupRepository extends JpaRepository<AmenityGroup, Long>, JpaSpecificationExecutor<AmenityGroup> {

    Optional<AmenityGroup> findByName(String name);

    boolean existsByName(String name);

    boolean existsByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);
}
