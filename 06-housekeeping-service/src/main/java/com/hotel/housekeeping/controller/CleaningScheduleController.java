package com.hotel.housekeeping.controller;

import com.hotel.housekeeping.dto.CleaningScheduleDto;
import com.hotel.housekeeping.service.CleaningScheduleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedule")
@CrossOrigin(origins = "*")
public class CleaningScheduleController {

    private final CleaningScheduleService scheduleService;

    public CleaningScheduleController(CleaningScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }

    @PostMapping
    public ResponseEntity<CleaningScheduleDto> createSchedule(@RequestBody CleaningScheduleDto scheduleDto) {
        return new ResponseEntity<>(scheduleService.createSchedule(scheduleDto), HttpStatus.CREATED);
    }

    @GetMapping("/today")
    public ResponseEntity<List<CleaningScheduleDto>> getTodaySchedule() {
        return ResponseEntity.ok(scheduleService.getTodaySchedule());
    }
}
