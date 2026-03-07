# Inventory Frontend (Next.js)

Next.js 14 App Router frontend for the inventory backend.  
Uses **TypeScript**, **Tailwind CSS**, **TanStack Query**, **axios**, and **react-hot-toast**.

## Requirements

- Node.js 18+
- Backend running at `http://localhost:8080` (see `../backend/README.md`)

## Setup & run

```bash
cd "F:\Inventory Management\frontend"
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` – start dev server (port 3000)
- `npm run build` – production build
- `npm run start` – run production server
- `npm run lint` – run ESLint

## Optional: API URL

To point at a different backend, set:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

Create `.env.local` in the frontend root with the above (or your URL). Default is `http://localhost:8080/api`.

## Structure

- `src/app/` – App Router: `layout.tsx`, `page.tsx`, `globals.css`
- `src/components/` – `InventoryDashboard`, `AddItemModal`, `EditItemModal`, `ItemDetailsCard`, `Providers`
- `src/lib/api.ts` – API client and inventory endpoints
- `src/types/inventory.ts` – TypeScript types

## Features

- **Dashboard** – table of all items, low-stock highlight, warning banner
- **Create** – “Add New Item” modal → `POST /api/inventory`
- **Read** – list from `GET /api/inventory`; click item name for details card
- **Update** – per-row Add/Consume stock → `PUT /api/inventory/stock/{id}`; Edit modal → `PUT /api/inventory/{id}`
- **Delete** – per-row Delete with confirm → `DELETE /api/inventory/{id}`
