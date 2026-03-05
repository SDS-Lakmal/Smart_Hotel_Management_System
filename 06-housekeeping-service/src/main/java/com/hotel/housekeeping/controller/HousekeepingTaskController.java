package com.hotel.housekeeping.controller;

import com.hotel.housekeeping.dto.HousekeepingTaskDto;
import com.hotel.housekeeping.entity.TaskStatus;
import com.hotel.housekeeping.service.HousekeepingTaskService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class HousekeepingTaskController {

    private final HousekeepingTaskService taskService;

    public HousekeepingTaskController(HousekeepingTaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public ResponseEntity<HousekeepingTaskDto> createTask(@RequestBody HousekeepingTaskDto taskDto) {
        return new ResponseEntity<>(taskService.createTask(taskDto), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<HousekeepingTaskDto>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    @GetMapping("/room/{roomId}")
    public ResponseEntity<List<HousekeepingTaskDto>> getTasksByRoomId(@PathVariable Long roomId) {
        return ResponseEntity.ok(taskService.getTasksByRoomId(roomId));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<HousekeepingTaskDto> updateTaskStatus(
            @PathVariable Long id, 
            @RequestParam TaskStatus status) {
        return ResponseEntity.ok(taskService.updateTaskStatus(id, status));
    }
}
