package com.hotel.housekeeping.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "rooms")
public class Room {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String roomNumber;

    private Integer floor;
    
    private String type;

    @Enumerated(EnumType.STRING)
    private RoomCleaningStatus status;

    private LocalDateTime lastCleaned;

    public Room() {
    }

    public Room(Long id, String roomNumber, Integer floor, String type, RoomCleaningStatus status, LocalDateTime lastCleaned) {
        this.id = id;
        this.roomNumber = roomNumber;
        this.floor = floor;
        this.type = type;
        this.status = status;
        this.lastCleaned = lastCleaned;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public Integer getFloor() {
        return floor;
    }

    public void setFloor(Integer floor) {
        this.floor = floor;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public RoomCleaningStatus getStatus() {
        return status;
    }

    public void setStatus(RoomCleaningStatus status) {
        this.status = status;
    }

    public LocalDateTime getLastCleaned() {
        return lastCleaned;
    }

    public void setLastCleaned(LocalDateTime lastCleaned) {
        this.lastCleaned = lastCleaned;
    }
}
