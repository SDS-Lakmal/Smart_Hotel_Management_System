package com.hotel.housekeeping.service;

import com.hotel.housekeeping.dto.HousekeepingStaffDto;

import java.util.List;

public interface HousekeepingStaffService {
    HousekeepingStaffDto createStaff(HousekeepingStaffDto staffDto);
    HousekeepingStaffDto getStaffById(Long id);
    List<HousekeepingStaffDto> getAllStaff();
    HousekeepingStaffDto updateStaff(Long id, HousekeepingStaffDto staffDto);
}
