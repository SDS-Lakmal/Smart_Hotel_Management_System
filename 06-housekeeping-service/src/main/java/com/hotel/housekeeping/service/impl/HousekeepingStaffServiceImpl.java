package com.hotel.housekeeping.service.impl;

import com.hotel.housekeeping.dto.HousekeepingStaffDto;
import com.hotel.housekeeping.entity.HousekeepingStaff;
import com.hotel.housekeeping.exception.ResourceNotFoundException;
import com.hotel.housekeeping.repository.HousekeepingStaffRepository;
import com.hotel.housekeeping.service.HousekeepingStaffService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HousekeepingStaffServiceImpl implements HousekeepingStaffService {

    private final HousekeepingStaffRepository staffRepository;

    public HousekeepingStaffServiceImpl(HousekeepingStaffRepository staffRepository) {
        this.staffRepository = staffRepository;
    }

    @Override
    public HousekeepingStaffDto createStaff(HousekeepingStaffDto staffDto) {
        HousekeepingStaff staff = mapToEntity(staffDto);
        HousekeepingStaff savedStaff = staffRepository.save(staff);
        return mapToDto(savedStaff);
    }

    @Override
    public HousekeepingStaffDto getStaffById(Long id) {
        HousekeepingStaff staff = staffRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found with id: " + id));
        return mapToDto(staff);
    }

    @Override
    public List<HousekeepingStaffDto> getAllStaff() {
        return staffRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public HousekeepingStaffDto updateStaff(Long id, HousekeepingStaffDto staffDto) {
        HousekeepingStaff staff = staffRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found with id: " + id));
        staff.setName(staffDto.getName());
        staff.setPhone(staffDto.getPhone());
        staff.setShift(staffDto.getShift());
        staff.setStatus(staffDto.getStatus());
        
        HousekeepingStaff updatedStaff = staffRepository.save(staff);
        return mapToDto(updatedStaff);
    }

    private HousekeepingStaff mapToEntity(HousekeepingStaffDto dto) {
        return new HousekeepingStaff(
                dto.getId(),
                dto.getName(),
                dto.getPhone(),
                dto.getShift(),
                dto.getStatus()
        );
    }

    private HousekeepingStaffDto mapToDto(HousekeepingStaff entity) {
        return new HousekeepingStaffDto(
                entity.getId(),
                entity.getName(),
                entity.getPhone(),
                entity.getShift(),
                entity.getStatus()
        );
    }
}
