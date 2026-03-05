package com.hotel.housekeeping.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "cleaning_schedule")
public class CleaningSchedule {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long roomId;

    @Column(nullable = false)
    private LocalDate scheduledDate;

    private Long taskId;

    @Enumerated(EnumType.STRING)
    private TaskStatus status;

    public CleaningSchedule() {
    }

    public CleaningSchedule(Long id, Long roomId, LocalDate scheduledDate, Long taskId, TaskStatus status) {
        this.id = id;
        this.roomId = roomId;
        this.scheduledDate = scheduledDate;
        this.taskId = taskId;
        this.status = status;
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

    public LocalDate getScheduledDate() {
        return scheduledDate;
    }

    public void setScheduledDate(LocalDate scheduledDate) {
        this.scheduledDate = scheduledDate;
    }

    public Long getTaskId() {
        return taskId;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }
}
