export interface InventoryItem {
  inventoryId: number;
  itemName: string;
  category: string;
  quantity: number;
  reorderLevel: number;
}

export interface ApiError {
  message?: string;
  errors?: Record<string, string>;
}

