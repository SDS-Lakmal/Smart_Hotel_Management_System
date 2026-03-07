package com.hotel.inventory.service;

import com.hotel.inventory.entity.InventoryItem;
import com.hotel.inventory.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    public InventoryItem addNewItem(InventoryItem item) {
        if (item.getQuantity() < 0) {
            item.setQuantity(0);
        }
        if (item.getReorderLevel() == null || item.getReorderLevel() < 0) {
            item.setReorderLevel(10);
        }
        return inventoryRepository.save(item);
    }

    public List<InventoryItem> getAllItems() {
        return inventoryRepository.findAll();
    }

    public InventoryItem getItem(Long id) {
        return inventoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Inventory item not found with id " + id));
    }

    public InventoryItem updateItem(Long id, InventoryItem updated) {
        InventoryItem existing = inventoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Inventory item not found with id " + id));

        existing.setItemName(updated.getItemName());
        existing.setCategory(updated.getCategory());
        existing.setQuantity(Math.max(0, updated.getQuantity()));
        existing.setReorderLevel(
                (updated.getReorderLevel() == null || updated.getReorderLevel() < 0)
                        ? 10
                        : updated.getReorderLevel()
        );

        return inventoryRepository.save(existing);
    }

    public void deleteItem(Long id) {
        // Make delete idempotent: if item is already gone, do nothing.
        if (inventoryRepository.existsById(id)) {
            inventoryRepository.deleteById(id);
        }
    }

    @Transactional
    public InventoryItem updateStock(Long id, int qty) {
        InventoryItem item = inventoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Inventory item not found with id " + id));

        item.updateStock(qty);
        return inventoryRepository.save(item);
    }
}

