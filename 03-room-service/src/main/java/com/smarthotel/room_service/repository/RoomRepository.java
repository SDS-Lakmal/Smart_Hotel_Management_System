package com.smarthotel.room_service.repository;

import com.smarthotel.room_service.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    // මේකෙන් තමයි database එකේ save, update, delete වැඩ ටික ලේසියෙන් කරගන්නේ
}