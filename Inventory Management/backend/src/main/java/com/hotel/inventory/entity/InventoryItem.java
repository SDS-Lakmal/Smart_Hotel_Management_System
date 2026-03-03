package com.hotel.inventory.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "inventory_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long inventoryId;

    @NotBlank(message = "Item name is required")
    @Column(nullable = false)
    private String itemName;

    @NotBlank(message = "Category is required")
    @Column(nullable = false)
    private String category;

    @Min(value = 0, message = "Quantity cannot be negative")
    @Column(nullable = false)
    private int quantity = 0;

    @NotNull(message = "Reorder level is required")
    @Min(value = 0, message = "Reorder level cannot be negative")
    @Column(nullable = false)
    private Integer reorderLevel = 10;

    public void updateStock(int qty) {
        if (quantity + qty < 0) {
            throw new IllegalArgumentException(
                "Cannot reduce stock below zero. Current: " + quantity + ", requested change: " + qty
            );
        }
        quantity += qty;
    }
}

