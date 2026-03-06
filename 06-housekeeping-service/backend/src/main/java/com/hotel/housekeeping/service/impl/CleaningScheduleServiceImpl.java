package com.hotel.housekeeping.service.impl;

import com.hotel.housekeeping.dto.CleaningScheduleDto;
import com.hotel.housekeeping.entity.CleaningSchedule;
import com.hotel.housekeeping.entity.TaskStatus;
import com.hotel.housekeeping.repository.CleaningScheduleRepository;
import com.hotel.housekeeping.service.CleaningScheduleService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CleaningScheduleServiceImpl implements CleaningScheduleService {

    private final CleaningScheduleRepository scheduleRepository;

    public CleaningScheduleServiceImpl(CleaningScheduleRepository scheduleRepository) {
        this.scheduleRepository = scheduleRepository;
    }

    @Override
    public CleaningScheduleDto createSchedule(CleaningScheduleDto scheduleDto) {
        scheduleDto.setStatus(TaskStatus.PENDING);
        CleaningSchedule schedule = mapToEntity(scheduleDto);
        CleaningSchedule savedSchedule = scheduleRepository.save(schedule);
        return mapToDto(savedSchedule);
    }

    @Override
    public List<CleaningScheduleDto> getTodaySchedule() {
        LocalDate today = LocalDate.now();
        return scheduleRepository.findByScheduledDate(today).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private CleaningSchedule mapToEntity(CleaningScheduleDto dto) {
        return new CleaningSchedule(
                dto.getId(),
                dto.getRoomId(),
                dto.getScheduledDate(),
                dto.getTaskId(),
                dto.getStatus()
        );
    }

    private CleaningScheduleDto mapToDto(CleaningSchedule entity) {
        return new CleaningScheduleDto(
                entity.getId(),
                entity.getRoomId(),
                entity.getScheduledDate(),
                entity.getTaskId(),
                entity.getStatus()
        );
    }
}
