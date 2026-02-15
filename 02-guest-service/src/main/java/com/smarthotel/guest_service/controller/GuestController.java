package com.smarthotel.guest_service.controller;

import com.smarthotel.guest_service.model.Guest;
import com.smarthotel.guest_service.repository.GuestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guests")
@CrossOrigin(origins = "*")
public class GuestController {

    @Autowired
    private GuestRepository guestRepository;

    // register new guest
    @PostMapping
    public Guest registerGuest(@RequestBody Guest guest) {
        // save to db
        return guestRepository.save(guest);
    }

    // all guests
    @GetMapping
    public List<Guest> getAllGuests() {
        return guestRepository.findAll();
    }
}