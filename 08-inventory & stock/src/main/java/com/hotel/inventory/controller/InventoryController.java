package com.hotel.inventory.controller;

import com.hotel.inventory.dto.UpdateStockRequest;
import com.hotel.inventory.entity.InventoryItem;
import com.hotel.inventory.service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
// Allow local frontend dev origins (Next dev runs on :3000)
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping("/{id}")
    public ResponseEntity<InventoryItem> getItem(@PathVariable("id") Long id) {
        InventoryItem item = inventoryService.getItem(id);
        return ResponseEntity.ok(item);
    }

    @PostMapping
    public ResponseEntity<InventoryItem> createItem(@Valid @RequestBody InventoryItem item) {
        InventoryItem saved = inventoryService.addNewItem(item);
        return ResponseEntity
                .created(URI.create("/api/inventory/" + saved.getInventoryId()))
                .body(saved);
    }

    @GetMapping
    public ResponseEntity<List<InventoryItem>> getAllItems() {
        return ResponseEntity.ok(inventoryService.getAllItems());
    }

    @PutMapping("/{id}")
    public ResponseEntity<InventoryItem> updateItem(
            @PathVariable("id") Long id,
            @Valid @RequestBody InventoryItem item
    ) {
        InventoryItem updated = inventoryService.updateItem(id, item);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable("id") Long id) {
        inventoryService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/stock/{id}")
    public ResponseEntity<InventoryItem> updateStock(
            @PathVariable("id") Long id,
            @Valid @RequestBody UpdateStockRequest request
    ) {
        InventoryItem updated = inventoryService.updateStock(id, request.getQty());
        return ResponseEntity.ok(updated);
    }
}

