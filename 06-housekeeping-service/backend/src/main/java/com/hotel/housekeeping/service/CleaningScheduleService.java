package com.hotel.housekeeping.service;

import com.hotel.housekeeping.dto.CleaningScheduleDto;

import java.util.List;

public interface CleaningScheduleService {
    CleaningScheduleDto createSchedule(CleaningScheduleDto scheduleDto);
    List<CleaningScheduleDto> getTodaySchedule();
}
