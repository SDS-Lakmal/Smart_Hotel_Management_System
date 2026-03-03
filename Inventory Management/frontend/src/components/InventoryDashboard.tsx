import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, PlusCircle, Pencil, Trash2, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  fetchInventory,
  updateStock,
  updateInventoryItem,
  deleteInventoryItem
} from '../lib/api';
import type { InventoryItem, ApiError } from '../types/inventory';
import { AddItemModal } from './AddItemModal';

interface RowStockInputs {
  [id: number]: {
    add: number;
    consume: number;
  };
}

export const InventoryDashboard: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [rowInputs, setRowInputs] = useState<RowStockInputs>({});
   const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
   const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
   const [editForm, setEditForm] = useState({
     itemName: '',
     category: '',
     quantity: 0,
     reorderLevel: 0
   });
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<InventoryItem[]>({
    queryKey: ['inventory'],
    queryFn: fetchInventory
  });

  const stockMutation = useMutation({
    mutationFn: updateStock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success('Stock updated');
    },
    onError: (error: any) => {
      const err: ApiError | undefined = error?.response?.data;
      const message = err?.message ?? 'Failed to update stock';
      toast.error(message);
    }
  });

  const updateItemMutation = useMutation({
    mutationFn: updateInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success('Item updated');
      setEditingItem(null);
    },
    onError: (error: any) => {
      const err: ApiError | undefined = error?.response?.data;
      const message = err?.message ?? 'Failed to update item';
      toast.error(message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success('Item deleted');
    },
    onError: (error: any) => {
      const err: ApiError | undefined = error?.response?.data;
      const message = err?.message ?? 'Failed to delete item';
      toast.error(message);
      // Optional: log for debugging in browser console
      // eslint-disable-next-line no-console
      console.error('Delete error', error);
    }
  });

  const lowStockItems =
    data?.filter((item) => item.quantity <= item.reorderLevel) ?? [];

  const handleInputChange = (
    id: number,
    type: 'add' | 'consume',
    value: string
  ) => {
    const numeric = Number(value) || 0;
    setRowInputs((prev) => ({
      ...prev,
      [id]: {
        add: prev[id]?.add ?? 0,
        consume: prev[id]?.consume ?? 0,
        [type]: numeric
      }
    }));
  };

  const handleUpdateStock = (item: InventoryItem, mode: 'add' | 'consume') => {
    const row = rowInputs[item.inventoryId] || { add: 0, consume: 0 };
    const value = mode === 'add' ? row.add : row.consume;

    if (value === 0) {
      toast.error('Please enter a quantity');
      return;
    }

    const qty = mode === 'add' ? value : -Math.abs(value);
    stockMutation.mutate({ id: item.inventoryId, qty });
  };

  const openEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setEditForm({
      itemName: item.itemName,
      category: item.category,
      quantity: item.quantity,
      reorderLevel: item.reorderLevel
    });
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]:
        name === 'quantity' || name === 'reorderLevel'
          ? Number(value)
          : value
    }));
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    updateItemMutation.mutate({
      id: editingItem.inventoryId,
      item: editForm
    });
  };

  const handleDelete = (id: number) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }
    deleteMutation.mutate(id);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Inventory &amp; Stock Management
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Track hotel supplies like toiletries, cleaning kits, kitchen ingredients, and linens.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
        >
          <PlusCircle className="h-4 w-4" />
          Add New Item
        </button>
      </header>

      {lowStockItems.length > 0 && (
        <div className="mb-4 flex items-start gap-3 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-500" />
          <div>
            <p className="font-medium">Low stock warning</p>
            <p className="mt-1">
              {lowStockItems.length} item(s) are at or below their reorder level. Consider restocking soon.
            </p>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          {isLoading && (
            <div className="p-6 text-center text-sm text-slate-600">
              Loading inventory...
            </div>
          )}

          {isError && !isLoading && (
            <div className="p-6 text-center text-sm text-red-600">
              Failed to load inventory. Ensure the backend is running on http://localhost:8080.
            </div>
          )}

          {!isLoading && !isError && (!data || data.length === 0) && (
            <div className="p-6 text-center text-sm text-slate-600">
              No items found. Add the first inventory item to get started.
            </div>
          )}

          {!isLoading && !isError && data && data.length > 0 && (
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                    Item Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                    Category
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-500">
                    Current Quantity
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-500">
                    Reorder Level
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {data.map((item) => {
                  const isLow = item.quantity <= item.reorderLevel;
                  const row = rowInputs[item.inventoryId] || { add: 0, consume: 0 };
                  return (
                    <tr
                      key={item.inventoryId}
                      className={
                        isLow
                          ? 'bg-red-50 hover:bg-red-100/80'
                          : 'hover:bg-slate-50'
                      }
                    >
                      <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-900">
                        <button
                          type="button"
                          onClick={() => setSelectedItem(item)}
                          className="inline-flex items-center gap-1 text-left text-indigo-700 hover:underline"
                        >
                          <Info className="h-3 w-3" />
                          {item.itemName}
                        </button>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">
                        {item.category}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-mono text-slate-900">
                        {item.quantity}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-mono text-slate-700">
                        {item.reorderLevel}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <span
                          className={
                            isLow
                              ? 'inline-flex rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700'
                              : 'inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700'
                          }
                        >
                          {isLow ? 'Low Stock' : 'OK'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min={0}
                              value={row.add || ''}
                              placeholder="Qty"
                              onChange={(e) =>
                                handleInputChange(
                                  item.inventoryId,
                                  'add',
                                  e.target.value
                                )
                              }
                              className="w-20 rounded-md border border-slate-300 px-2 py-1 text-xs shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                            <button
                              type="button"
                              onClick={() => handleUpdateStock(item, 'add')}
                              disabled={stockMutation.isPending}
                              className="rounded-md bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                              Add
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min={0}
                              value={row.consume || ''}
                              placeholder="Qty"
                              onChange={(e) =>
                                handleInputChange(
                                  item.inventoryId,
                                  'consume',
                                  e.target.value
                                )
                              }
                              className="w-20 rounded-md border border-slate-300 px-2 py-1 text-xs shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                            <button
                              type="button"
                              onClick={() => handleUpdateStock(item, 'consume')}
                              disabled={stockMutation.isPending}
                              className="rounded-md bg-red-600 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                              Consume
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => openEdit(item)}
                              className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                            >
                              <Pencil className="h-3 w-3" />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(item.inventoryId)}
                              disabled={deleteMutation.isPending}
                              className="inline-flex items-center gap-1 rounded-md border border-red-200 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                              <Trash2 className="h-3 w-3" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <AddItemModal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

      {selectedItem && (
        <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              Item details
            </h2>
            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              className="text-xs text-slate-500 hover:text-slate-700"
            >
              Close
            </button>
          </div>
          <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <div>
              <dt className="text-slate-500">Name</dt>
              <dd className="font-medium text-slate-900">
                {selectedItem.itemName}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Category</dt>
              <dd className="font-medium text-slate-900">
                {selectedItem.category}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Quantity</dt>
              <dd className="font-mono text-slate-900">
                {selectedItem.quantity}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Reorder level</dt>
              <dd className="font-mono text-slate-900">
                {selectedItem.reorderLevel}
              </dd>
            </div>
          </dl>
        </div>
      )}

      {editingItem && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Edit Inventory Item
              </h2>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="rounded-full p-1 text-slate-500 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Item Name
                </label>
                <input
                  name="itemName"
                  value={editForm.itemName}
                  onChange={handleEditChange}
                  required
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Category
                </label>
                <select
                  name="category"
                  value={editForm.category}
                  onChange={handleEditChange}
                  required
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">Select category</option>
                  <option value="Toiletries">Toiletries</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Kitchen">Kitchen</option>
                  <option value="Linens">Linens</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    min={0}
                    value={editForm.quantity}
                    onChange={handleEditChange}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Reorder Level
                  </label>
                  <input
                    type="number"
                    name="reorderLevel"
                    min={0}
                    value={editForm.reorderLevel}
                    onChange={handleEditChange}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateItemMutation.isPending}
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {updateItemMutation.isPending ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

