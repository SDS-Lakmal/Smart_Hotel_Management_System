package com.smarthotel.guest_service.model;

import jakarta.persistence.*;

@Entity // database table
@Table(name = "guests") // table name
public class Guest {

    @Id // Primary Key එක
    @GeneratedValue(strategy = GenerationType.IDENTITY) // ID auto in.
    private Long guestId;
    private String name;
    private String nic;
    private String phone;
    private String email;

    // empty Constructor
    public Guest() {
    }

    public Guest(String name, String nic, String phone, String email) {
        this.name = name;
        this.nic = nic;
        this.phone = phone;
        this.email = email;
    }

    // Getters Setters
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
}