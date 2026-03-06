package com.hotel.staff_service.service;

import com.hotel.staff_service.model.Staff;
import com.hotel.staff_service.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StaffService {

    private final StaffRepository staffRepository;

    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }

    public Staff getStaffById(Long id) {
        return staffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found with id: " + id));
    }

    public Staff createStaff(Staff staff) {
        return staffRepository.save(staff);
    }

    public Staff updateStaff(Long id, Staff updatedStaff) {
        Staff existingStaff = getStaffById(id);
        existingStaff.setName(updatedStaff.getName());
        existingStaff.setRole(updatedStaff.getRole());
        existingStaff.setEmail(updatedStaff.getEmail());
        return staffRepository.save(existingStaff);
    }

    public void deleteStaff(Long id) {
        staffRepository.deleteById(id);
    }
}
