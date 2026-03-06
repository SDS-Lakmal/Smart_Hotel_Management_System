package com.hotel.housekeeping.controller;

import com.hotel.housekeeping.dto.HousekeepingStaffDto;
import com.hotel.housekeeping.service.HousekeepingStaffService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
@CrossOrigin(origins = "*")
public class HousekeepingStaffController {

    private final HousekeepingStaffService staffService;

    public HousekeepingStaffController(HousekeepingStaffService staffService) {
        this.staffService = staffService;
    }

    @PostMapping
    public ResponseEntity<HousekeepingStaffDto> createStaff(@RequestBody HousekeepingStaffDto staffDto) {
        return new ResponseEntity<>(staffService.createStaff(staffDto), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<HousekeepingStaffDto>> getAllStaff() {
        return ResponseEntity.ok(staffService.getAllStaff());
    }

    @PutMapping("/{id}")
    public ResponseEntity<HousekeepingStaffDto> updateStaff(
            @PathVariable Long id, 
            @RequestBody HousekeepingStaffDto staffDto) {
        return ResponseEntity.ok(staffService.updateStaff(id, staffDto));
    }
}
