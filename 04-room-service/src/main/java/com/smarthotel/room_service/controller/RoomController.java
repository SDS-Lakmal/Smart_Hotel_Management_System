package com.smarthotel.room_service.controller;

import com.smarthotel.room_service.model.Room;
import com.smarthotel.room_service.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*")
public class RoomController {

    @Autowired
    private RoomRepository roomRepository;

    // Add a new room to the inventory
    @PostMapping
    public Room addRoom(@RequestBody Room room) {
        return roomRepository.save(room);
    }

    // Update room details and status
    @PutMapping("/{roomNumber}")
    public Room updateRoom(@PathVariable Long roomNumber, @RequestBody Room room) {
        room.setRoomNumber(roomNumber);
        return roomRepository.save(room);
    }
}
