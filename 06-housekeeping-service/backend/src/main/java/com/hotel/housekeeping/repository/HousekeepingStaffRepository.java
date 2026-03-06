package com.hotel.housekeeping.repository;

import com.hotel.housekeeping.entity.HousekeepingStaff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HousekeepingStaffRepository extends JpaRepository<HousekeepingStaff, Long> {
}
