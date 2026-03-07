import axios from 'axios';
import type { InventoryItem } from '@/types/inventory';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

export async function fetchInventory(): Promise<InventoryItem[]> {
  const res = await api.get<InventoryItem[]>('/inventory');
  return res.data;
}

export async function fetchInventoryItem(id: number): Promise<InventoryItem> {
  const res = await api.get<InventoryItem>(`/inventory/${id}`);
  return res.data;
}

export interface CreateItemPayload {
  itemName: string;
  category: string;
  quantity: number;
  reorderLevel: number;
}

export async function createInventoryItem(
  payload: CreateItemPayload
): Promise<InventoryItem> {
  const res = await api.post<InventoryItem>('/inventory', payload);
  return res.data;
}

export interface UpdateItemPayload {
  id: number;
  item: {
    itemName: string;
    category: string;
    quantity: number;
    reorderLevel: number;
  };
}

export async function updateInventoryItem({
  id,
  item,
}: UpdateItemPayload): Promise<InventoryItem> {
  const res = await api.put<InventoryItem>(`/inventory/${id}`, item);
  return res.data;
}

export interface UpdateStockPayload {
  id: number;
  qty: number;
}

export async function updateStock({
  id,
  qty,
}: UpdateStockPayload): Promise<InventoryItem> {
  const res = await api.put<InventoryItem>(`/inventory/stock/${id}`, { qty });
  return res.data;
}

export async function deleteInventoryItem(id: number): Promise<void> {
  await api.delete(`/inventory/${id}`);
}
