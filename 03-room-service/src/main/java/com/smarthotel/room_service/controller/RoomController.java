package com.smarthotel.room_service.controller;

import com.smarthotel.room_service.model.Room;
import com.smarthotel.room_service.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*") // Frontend එකට access දෙන්න [cite: 25, 28]
public class RoomController {

    @Autowired
    private RoomRepository roomRepository;

    // POST /api/rooms - Add a new room [cite: 51]
    @PostMapping
    public Room addRoom(@RequestBody Room room) {
        return roomRepository.save(room);
    }

    // GET /api/rooms - Retrieve all rooms [cite: 42]
    @GetMapping
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    // PUT /api/rooms/{roomNumber} - Update room details and status [cite: 53]
    @PutMapping("/{roomNumber}")
    public Room updateRoom(@PathVariable String roomNumber, @RequestBody Room roomDetails) {
        Room room = roomRepository.findById(roomNumber).orElseThrow();
        room.setType(roomDetails.getType());
        room.setPrice(roomDetails.getPrice());
        room.setStatus(roomDetails.getStatus());
        return roomRepository.save(room);
    }
}