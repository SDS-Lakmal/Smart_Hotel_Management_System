package com.smarthotel.room_service.controller;

import com.smarthotel.room_service.model.Room;
import com.smarthotel.room_service.repository.RoomRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomRepository roomRepository;

    public RoomController(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    // 1. අලුත් කාමරයක් ඇතුළත් කිරීම (POST /api/rooms) [cite: 55]
    @PostMapping
    public Room addRoom(@RequestBody Room room) {
        return roomRepository.save(room);
    }

    // 2. කාමර විස්තර update කිරීම (PUT /api/rooms/{id}) [cite: 56]
    @PutMapping("/{id}")
    public Room updateRoom(@PathVariable Long id, @RequestBody Room roomDetails) {
        Room room = roomRepository.findById(id).orElseThrow();
        room.setRoomNumber(roomDetails.getRoomNumber());
        room.setPrice(roomDetails.getPrice()); // මෙතනදී අපි හදපු setPrice logic එක වැඩ කරනවා [cite: 51, 52]
        room.setStatus(roomDetails.getStatus());
        return roomRepository.save(room);
    }

    // සියලුම කාමර බැලීමට (Frontend Dashboard එකට ඕන වෙනවා)
    @GetMapping
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }
}