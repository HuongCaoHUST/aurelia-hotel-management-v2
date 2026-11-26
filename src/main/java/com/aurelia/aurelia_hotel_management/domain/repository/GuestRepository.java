package com.aurelia.aurelia_hotel_management.domain.repository;
import com.aurelia.aurelia_hotel_management.domain.entity.Guest; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface GuestRepository extends JpaRepository<Guest, UUID> { Optional<Guest> findByEmail(String email); }
