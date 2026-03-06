package com.hotel.housekeeping.dto;

import com.hotel.housekeeping.entity.TaskStatus;
import java.time.LocalDateTime;

public class HousekeepingTaskDto {
    private Long id;
    private Long roomId;
    private String taskDescription;
    private Long assignedStaffId;
    private TaskStatus status;
    private String priority;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;

    public HousekeepingTaskDto() {
    }

    public HousekeepingTaskDto(Long id, Long roomId, String taskDescription, Long assignedStaffId, TaskStatus status, String priority, LocalDateTime createdAt, LocalDateTime completedAt) {
        this.id = id;
        this.roomId = roomId;
        this.taskDescription = taskDescription;
        this.assignedStaffId = assignedStaffId;
        this.status = status;
        this.priority = priority;
        this.createdAt = createdAt;
        this.completedAt = completedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public String getTaskDescription() {
        return taskDescription;
    }

    public void setTaskDescription(String taskDescription) {
        this.taskDescription = taskDescription;
    }

    public Long getAssignedStaffId() {
        return assignedStaffId;
    }

    public void setAssignedStaffId(Long assignedStaffId) {
        this.assignedStaffId = assignedStaffId;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}
