'use client';

import type { InventoryItem } from '@/types/inventory';

export function ItemDetailsCard({
  item,
  onClose,
}: {
  item: InventoryItem | null;
  onClose: () => void;
}) {
  if (!item) return null;
  return (
    <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">Item details</h2>
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-slate-500 hover:text-slate-700"
        >
          Close
        </button>
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
        <div>
          <dt className="text-slate-500">Name</dt>
          <dd className="font-medium text-slate-900">{item.itemName}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Category</dt>
          <dd className="font-medium text-slate-900">{item.category}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Quantity</dt>
          <dd className="font-mono text-slate-900">{item.quantity}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Reorder level</dt>
          <dd className="font-mono text-slate-900">{item.reorderLevel}</dd>
        </div>
      </dl>
    </div>
  );
}
