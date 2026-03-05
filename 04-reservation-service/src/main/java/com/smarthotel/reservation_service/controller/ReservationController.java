package com.smarthotel.reservation_service.controller;

import com.smarthotel.reservation_service.model.Reservation;
import com.smarthotel.reservation_service.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "*")
public class ReservationController {

    @Autowired
    private ReservationRepository reservationRepository;

    // Create a new booking
    @PostMapping
    public Reservation createReservation(@RequestBody Reservation reservation) {
        return reservationRepository.save(reservation);
    }

    // View active reservations
    @GetMapping("/active")
    public List<Reservation> getActiveReservations() {
        return reservationRepository.findByCheckOutGreaterThanEqual(LocalDate.now());
    }
}
