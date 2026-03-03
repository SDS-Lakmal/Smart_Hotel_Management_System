# Inventory Frontend (React + Vite)

React 18 + TypeScript + Tailwind dashboard for the inventory backend.

## Requirements

- Node.js 18+ (includes `npm`)
- Backend running at `http://localhost:8080` (see `../backend/README.md`)

## Install & run

From the `frontend` folder:

```bash
cd "F:\Inventory Management\frontend"
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Tech stack

- React 18
- Vite
- TypeScript
- Tailwind CSS
- @tanstack/react-query (data fetching)
- axios (HTTP client)
- react-hot-toast (notifications)
- lucide-react (icons)

## Features

- Inventory dashboard showing:
  - Item name, category, quantity, reorder level
  - Status badge (**Low Stock** / **OK**)
  - Row highlight for low stock items
- Top warning banner if any item is at/below reorder level.
- **Create**: “Add New Item” modal (POST `/api/inventory`).
- **Read**: Table of all items (GET `/api/inventory`).
- **Update stock**:
  - Per‑row “Add” and “Consume” stock controls (PUT `/api/inventory/stock/{id}` with `qty`).
  - Backend enforces no negative stock; errors shown as toasts.
- **Edit**: Per‑row “Edit” opens modal to update name, category, quantity, reorder level (PUT `/api/inventory/{id}`).
- **Delete**: Per‑row “Delete” with confirmation (DELETE `/api/inventory/{id}`).
- **Details**: Clicking an item name shows a small details card with key fields.

## Key files

- `src/App.tsx` – App shell.
- `src/components/InventoryDashboard.tsx` – main dashboard UI.
- `src/components/AddItemModal.tsx` – add item modal.
- `src/lib/api.ts` – axios client and inventory API helpers.
- `src/types/inventory.ts` – TypeScript types for inventory items and API errors.

