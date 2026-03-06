package com.hotel.housekeeping.dto;

import com.hotel.housekeeping.entity.RoomCleaningStatus;
import java.time.LocalDateTime;

public class RoomDto {
    private Long id;
    private String roomNumber;
    private Integer floor;
    private String type;
    private RoomCleaningStatus status;
    private LocalDateTime lastCleaned;

    public RoomDto() {
    }

    public RoomDto(Long id, String roomNumber, Integer floor, String type, RoomCleaningStatus status, LocalDateTime lastCleaned) {
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
