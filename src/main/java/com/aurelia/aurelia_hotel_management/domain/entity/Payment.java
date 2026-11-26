package com.aurelia.aurelia_hotel_management.domain.entity;

import com.aurelia.aurelia_hotel_management.domain.enums.*;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity @Table(name = "payments", indexes = {@Index(name = "idx_payments_reservation", columnList = "reservation_id"), @Index(name = "idx_payments_transaction_reference", columnList = "transaction_reference")})
@Getter @Setter @NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Payment extends BaseEntity {
    @Version private Long version;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "reservation_id", nullable = false, foreignKey = @ForeignKey(name = "fk_payments_reservation")) @ToString.Exclude private Reservation reservation;
    @Column(nullable = false, precision = 19, scale = 2) private BigDecimal amount;
    @Column(nullable = false, length = 3) private String currency = "VND";
    @Enumerated(EnumType.STRING) @Column(name = "payment_method", nullable = false, length = 30) private PaymentMethod paymentMethod;
    @Enumerated(EnumType.STRING) @Column(name = "payment_status", nullable = false, length = 20) private PaymentStatus paymentStatus = PaymentStatus.PENDING;
    @Column(name = "transaction_reference", length = 150) private String transactionReference;
    @Column(name = "paid_at") private LocalDateTime paidAt;
}
