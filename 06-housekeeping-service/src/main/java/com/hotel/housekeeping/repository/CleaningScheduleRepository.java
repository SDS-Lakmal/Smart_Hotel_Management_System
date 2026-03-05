package com.hotel.housekeeping.repository;

import com.hotel.housekeeping.entity.CleaningSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CleaningScheduleRepository extends JpaRepository<CleaningSchedule, Long> {
    List<CleaningSchedule> findByScheduledDate(LocalDate date);
    List<CleaningSchedule> findByRoomId(Long roomId);
}
