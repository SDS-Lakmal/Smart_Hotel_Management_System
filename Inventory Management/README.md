# Module 08 – Inventory & Stock Management 🧾📦

Full‑stack hotel inventory module built with **Spring Boot 3** (backend) and **React 18 + Vite + Tailwind** (frontend).

> Manages hotel supplies: toiletries, cleaning kits, kitchen ingredients, linens, etc.

---

## Tech stack

- ⚙️ **Backend**
  - Java 17
  - Spring Boot 3.2
  - Spring Web, Spring Data JPA, Bean Validation
  - H2 in‑memory database
  - Lombok

- 💻 **Frontend**
  - React 18 + TypeScript
  - Vite
  - Tailwind CSS
  - @tanstack/react-query
  - axios
  - react-hot-toast
  - lucide-react (icons)

Project layout:

```text
Inventory Management/
├── backend/   # Spring Boot API
└── frontend/  # React dashboard
```

---

## 1. Backend – Spring Boot API

Path: `backend/`  
Details: see also `backend/README.md`

### 1.1. Run the backend

**Option A – IntelliJ IDEA**

1. Open `backend` as a project.
2. Let IntelliJ import Maven from `pom.xml`.
3. Run `com.hotel.inventory.InventoryApplication` (green run icon on the `main` method).

**Option B – Command line (requires Maven on PATH)**

```bash
cd "F:\Inventory Management\backend"
mvn spring-boot:run
```

Or on Windows, you can double‑click:

- `backend\run-backend.bat`

The API listens on `http://localhost:8080`.

### 1.2. Database (H2)

Config in `backend/src/main/resources/application.yml`:

- URL: `jdbc:h2:mem:inventory`
- User: `sa`
- Password: _(empty)_
- Console: `http://localhost:8080/h2-console`

Schema is generated from JPA entities.  
Seed data is inserted from `backend/src/main/resources/data.sql`.

### 1.3. Core domain

- `InventoryItem` (`com.hotel.inventory.entity.InventoryItem`)
  - `inventoryId` – Long, primary key
  - `itemName` – String, required
  - `category` – String, required (`"Toiletries"`, `"Cleaning"`, `"Kitchen"`, `"Linens"`, etc.)
  - `quantity` – int, default `0`
  - `reorderLevel` – int, default `10`
  - `updateStock(int qty)` – business rule:
    - Positive `qty`: add stock
    - Negative `qty`: consume stock
    - Throws `IllegalArgumentException` if stock would go below 0

### 1.4. REST API

Base path: `http://localhost:8080/api/inventory`

- **Create**
  - `POST /api/inventory`
  - Body: `InventoryItem` JSON
  - Returns: created item

- **Read**
  - `GET /api/inventory` – list all items
  - `GET /api/inventory/{id}` – get a single item

- **Update**
  - `PUT /api/inventory/{id}` – update full item
    - Body: `InventoryItem` JSON
  - `PUT /api/inventory/stock/{id}` – update stock only
    - Body: `{ "qty": number }` (positive = add, negative = consume)

- **Delete**
  - `DELETE /api/inventory/{id}`
  - Idempotent – no error if item already deleted

### 1.5. Validation & errors

- Bean Validation on `InventoryItem` fields (`@NotBlank`, `@Min`, etc.).
- `GlobalExceptionHandler`:
  - Returns **400 Bad Request** with JSON `{ "message": "...", "errors": { ... } }` for:
    - Validation errors
    - Illegal operations (e.g., reducing stock below zero, unknown IDs)

---

## 2. Frontend – React Dashboard

Path: `frontend/`  
Details: see also `frontend/README.md`

### 2.1. Install & run

From a terminal:

```bash
cd "F:\Inventory Management\frontend"
npm install       # first time only
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

> Make sure the backend is running on `http://localhost:8080` before using the UI.

### 2.2. Main features

- **Inventory dashboard**
  - Table with:
    - Item Name
    - Category
    - Current Quantity
    - Reorder Level
    - Status badge:
      - **Low Stock** (red) when `quantity <= reorderLevel`
      - **OK** (green) otherwise
  - Low‑stock rows highlighted in light red
  - Warning banner at top when any items are low

- **Create (C in CRUD)**
  - “Add New Item” button opens a modal
  - Fields: item name, category, initial quantity, reorder level
  - Calls `POST /api/inventory`

- **Read (R in CRUD)**
  - Dashboard loads list via `GET /api/inventory`
  - Clicking an item name opens a details card with key info

- **Update (U in CRUD)**
  - Per‑row **Add Stock** and **Consume Stock** controls:
    - Call `PUT /api/inventory/stock/{id}` with `{ qty }`
  - Per‑row **Edit**:
    - Opens an edit modal (name, category, quantity, reorder level)
    - Calls `PUT /api/inventory/{id}`

- **Delete (D in CRUD)**
  - Per‑row **Delete** button with confirmation
  - Calls `DELETE /api/inventory/{id}`
  - On success, list refreshes and a toast is shown

All requests are handled via `axios` helpers in `frontend/src/lib/api.ts`, with data fetching/caching via `@tanstack/react-query` and notifications via `react-hot-toast`.

### 2.3. Key frontend files

- `src/App.tsx` – app root, mounts dashboard
- `src/components/InventoryDashboard.tsx` – main UI, table, CRUD actions
- `src/components/AddItemModal.tsx` – create form
- `src/lib/api.ts` – API client functions
- `src/types/inventory.ts` – TypeScript interfaces for items and error responses

---

## 3. Development tips

- Backend:
  - Use IntelliJ’s **Services → Database** or H2 console to inspect data.
  - Logs show executed SQL (`spring.jpa.show-sql=true`).
- Frontend:
  - Use browser DevTools → Network to see API calls.
  - React Query Devtools can be added if you want deeper inspection.

This module is ready to be integrated into a larger hotel management system or run standalone for inventory & stock tracking. 

