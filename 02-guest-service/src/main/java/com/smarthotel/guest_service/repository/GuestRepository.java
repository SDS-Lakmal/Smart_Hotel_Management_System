package com.smarthotel.guest_service.repository;

import com.smarthotel.guest_service.model.Guest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GuestRepository extends JpaRepository<Guest, Long> {

}