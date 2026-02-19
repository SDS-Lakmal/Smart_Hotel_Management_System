package com.smarthotel.guest_service.model;

import jakarta.persistence.*;
import java.time.LocalDateTime; // 1. Imported this to make time work

@Entity // database table
@Table(name = "guests") // table name
public class Guest {

    @Id // Primary Key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // ID auto increment
    private Long guestId;

    private String name;
    private String nic;
    private String phone;
    private String email;

    // 2. Newly added part: Registration time
    @Column(updatable = false) // This time cannot be changed later
    private LocalDateTime checkInTime;

    // 3. Function to automatically set time when a Guest is saved
    @PrePersist
    protected void onCreate() {
        this.checkInTime = LocalDateTime.now(); // Gets the current time
    }

    // empty Constructor
    public Guest() {
    }

    public Guest(String name, String nic, String phone, String email) {
        this.name = name;
        this.nic = nic;
        this.phone = phone;
        this.email = email;
    }

    // --- Getters and Setters ---

    public Long getGuestId() {
        return guestId;
    }

    public void setGuestId(Long guestId) {
        this.guestId = guestId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNic() {
        return nic;
    }

    public void setNic(String nic) {
        this.nic = nic;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    // 4. New Getter and Setter to get the time
    public LocalDateTime getCheckInTime() {
        return checkInTime;
    }

    public void setCheckInTime(LocalDateTime checkInTime) {
        this.checkInTime = checkInTime;
    }
}