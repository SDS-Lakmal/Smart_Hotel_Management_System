package com.smarthotel.room_service.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "rooms")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Room {
    @Id
    private String roomNumber; // Primary Key 
    private String type;       // AC/Non-AC 
    private double price;      // 
    private String status;     // Available/Booked 

    // OOP: Encapsulated logic to update room rates 
    public void setPrice(double price) {
        if (price > 0) {
            this.price = price;
        }
    }
}