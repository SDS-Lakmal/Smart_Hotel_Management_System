package com.hotel.housekeeping.dto;

import com.hotel.housekeeping.entity.StaffStatus;

public class HousekeepingStaffDto {
    private Long id;
    private String name;
    private String phone;
    private String shift;
    private StaffStatus status;

    public HousekeepingStaffDto() {
    }

    public HousekeepingStaffDto(Long id, String name, String phone, String shift, StaffStatus status) {
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.shift = shift;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getShift() {
        return shift;
    }

    public void setShift(String shift) {
        this.shift = shift;
    }

    public StaffStatus getStatus() {
        return status;
    }

    public void setStatus(StaffStatus status) {
        this.status = status;
    }
}
