package com.aurelia.hotelmanager.repository;

import com.aurelia.hotelmanager.model.Payment;
import com.aurelia.hotelmanager.model.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long>, JpaSpecificationExecutor<Payment> {

    Optional<Payment> findByTransactionReference(String transactionReference);

    List<Payment> findAllByReservationId(Long reservationId);

    List<Payment> findAllByStatus(PaymentStatus status);
}
