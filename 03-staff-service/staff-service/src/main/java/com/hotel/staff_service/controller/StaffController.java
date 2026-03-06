package com.hotel.staff_service.controller;

import com.hotel.staff_service.model.Staff;
import com.hotel.staff_service.service.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
@RequiredArgsConstructor
public class StaffController {

    private final StaffService staffService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF')")
    public ResponseEntity<List<Staff>> getAllStaff() {
        return ResponseEntity.ok(staffService.getAllStaff());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'STAFF')")
    public ResponseEntity<Staff> getStaffById(@PathVariable Long id) {
        return ResponseEntity.ok(staffService.getStaffById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Staff> createStaff(@RequestBody Staff staff) {
        return ResponseEntity.status(HttpStatus.CREATED).body(staffService.createStaff(staff));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Staff> updateStaff(@PathVariable Long id, @RequestBody Staff staff) {
        return ResponseEntity.ok(staffService.updateStaff(id, staff));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteStaff(@PathVariable Long id) {
        staffService.deleteStaff(id);
        return ResponseEntity.noContent().build();
    }
}
