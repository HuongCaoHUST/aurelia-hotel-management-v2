package com.aurelia.hotelmanager.repository;

import com.aurelia.hotelmanager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByRoles_Id(Long roleId);

    List<User> findAllByOrderByCreatedAtDesc();
}
