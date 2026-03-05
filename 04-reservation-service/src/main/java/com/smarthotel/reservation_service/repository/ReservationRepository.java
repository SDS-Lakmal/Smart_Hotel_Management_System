package com.smarthotel.reservation_service.repository;

import com.smarthotel.reservation_service.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByCheckOutGreaterThanEqual(LocalDate date);
}
