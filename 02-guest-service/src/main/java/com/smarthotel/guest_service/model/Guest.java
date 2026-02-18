package com.smarthotel.guest_service.model;

import jakarta.persistence.*;
import java.time.LocalDateTime; // 1. වෙලාව වැඩ කරන්න මේක Import කළා

@Entity // database table
@Table(name = "guests") // table name
public class Guest {

    @Id // Primary Key එක
    @GeneratedValue(strategy = GenerationType.IDENTITY) // ID auto increment
    private Long guestId;

    private String name;
    private String nic;
    private String phone;
    private String email;

    // 2. අලුතෙන් එකතු කළ කොටස: Register වෙන වෙලාව
    @Column(updatable = false) // මේ වෙලාව පස්සේ වෙනස් වෙන්න බෑ
    private LocalDateTime checkInTime;

    // 3. Guest කෙනෙක් Save වෙද්දී ඉබේම වෙලාව වැටෙන ෆන්ක්ෂන් එක
    @PrePersist
    protected void onCreate() {
        this.checkInTime = LocalDateTime.now(); // දැන් වෙලාව ගන්නවා
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

    // 4. වෙලාව ගන්න අලුත් Getter සහ Setter එක
    public LocalDateTime getCheckInTime() {
        return checkInTime;
    }

    public void setCheckInTime(LocalDateTime checkInTime) {
        this.checkInTime = checkInTime;
    }
}