package com.hotel.housekeeping.service;

import com.hotel.housekeeping.dto.HousekeepingTaskDto;
import com.hotel.housekeeping.entity.TaskStatus;

import java.util.List;

public interface HousekeepingTaskService {
    HousekeepingTaskDto createTask(HousekeepingTaskDto taskDto);
    HousekeepingTaskDto getTaskById(Long id);
    List<HousekeepingTaskDto> getAllTasks();
    List<HousekeepingTaskDto> getTasksByRoomId(Long roomId);
    HousekeepingTaskDto updateTaskStatus(Long id, TaskStatus status);
}
