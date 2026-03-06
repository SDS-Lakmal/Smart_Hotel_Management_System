package com.hotel.housekeeping.service.impl;

import com.hotel.housekeeping.dto.RoomDto;
import com.hotel.housekeeping.entity.Room;
import com.hotel.housekeeping.exception.ResourceNotFoundException;
import com.hotel.housekeeping.repository.RoomRepository;
import com.hotel.housekeeping.service.RoomService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;

    public RoomServiceImpl(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @Override
    public RoomDto createRoom(RoomDto roomDto) {
        Room room = mapToEntity(roomDto);
        Room savedRoom = roomRepository.save(room);
        return mapToDto(savedRoom);
    }

    @Override
    public RoomDto getRoomById(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));
        return mapToDto(room);
    }

    @Override
    public List<RoomDto> getAllRooms() {
        return roomRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public RoomDto updateRoom(Long id, RoomDto roomDto) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));
        
        room.setRoomNumber(roomDto.getRoomNumber());
        room.setFloor(roomDto.getFloor());
        room.setType(roomDto.getType());
        room.setStatus(roomDto.getStatus());
        room.setLastCleaned(roomDto.getLastCleaned());
        
        Room updatedRoom = roomRepository.save(room);
        return mapToDto(updatedRoom);
    }

    @Override
    public void deleteRoom(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));
        roomRepository.delete(room);
    }
    
    private Room mapToEntity(RoomDto dto) {
        return new Room(
                dto.getId(),
                dto.getRoomNumber(),
                dto.getFloor(),
                dto.getType(),
                dto.getStatus(),
                dto.getLastCleaned()
        );
    }
    
    private RoomDto mapToDto(Room entity) {
        return new RoomDto(
                entity.getId(),
                entity.getRoomNumber(),
                entity.getFloor(),
                entity.getType(),
                entity.getStatus(),
                entity.getLastCleaned()
        );
    }
}
