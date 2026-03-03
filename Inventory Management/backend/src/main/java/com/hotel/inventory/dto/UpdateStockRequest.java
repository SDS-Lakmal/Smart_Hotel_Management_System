package com.hotel.inventory.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateStockRequest {

    @NotNull(message = "Quantity change (qty) is required")
    private Integer qty;
}

