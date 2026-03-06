package com.hotel.housekeeping.service.impl;

import com.hotel.housekeeping.dto.HousekeepingTaskDto;
import com.hotel.housekeeping.entity.HousekeepingTask;
import com.hotel.housekeeping.entity.TaskStatus;
import com.hotel.housekeeping.exception.ResourceNotFoundException;
import com.hotel.housekeeping.repository.HousekeepingTaskRepository;
import com.hotel.housekeeping.service.HousekeepingTaskService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HousekeepingTaskServiceImpl implements HousekeepingTaskService {

    private final HousekeepingTaskRepository taskRepository;

    public HousekeepingTaskServiceImpl(HousekeepingTaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Override
    public HousekeepingTaskDto createTask(HousekeepingTaskDto taskDto) {
        taskDto.setStatus(TaskStatus.PENDING);
        HousekeepingTask task = mapToEntity(taskDto);
        HousekeepingTask savedTask = taskRepository.save(task);
        return mapToDto(savedTask);
    }

    @Override
    public HousekeepingTaskDto getTaskById(Long id) {
        HousekeepingTask task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        return mapToDto(task);
    }

    @Override
    public List<HousekeepingTaskDto> getAllTasks() {
        return taskRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<HousekeepingTaskDto> getTasksByRoomId(Long roomId) {
        return taskRepository.findByRoomId(roomId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public HousekeepingTaskDto updateTaskStatus(Long id, TaskStatus status) {
        HousekeepingTask task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        task.setStatus(status);
        if (status == TaskStatus.COMPLETED) {
            task.setCompletedAt(LocalDateTime.now());
        }
        HousekeepingTask updatedTask = taskRepository.save(task);
        return mapToDto(updatedTask);
    }

    private HousekeepingTask mapToEntity(HousekeepingTaskDto dto) {
        return new HousekeepingTask(
                dto.getId(),
                dto.getRoomId(),
                dto.getTaskDescription(),
                dto.getAssignedStaffId(),
                dto.getStatus(),
                dto.getPriority(),
                dto.getCreatedAt(),
                dto.getCompletedAt()
        );
    }

    private HousekeepingTaskDto mapToDto(HousekeepingTask entity) {
        return new HousekeepingTaskDto(
                entity.getId(),
                entity.getRoomId(),
                entity.getTaskDescription(),
                entity.getAssignedStaffId(),
                entity.getStatus(),
                entity.getPriority(),
                entity.getCreatedAt(),
                entity.getCompletedAt()
        );
    }
}
