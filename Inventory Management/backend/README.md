# Inventory Backend (Module 08)

Spring Boot 3.2 / Java 17 service for hotel inventory & stock management.

## Requirements

- Java 17+
- Maven (for CLI) or IntelliJ IDEA (Maven project import)

## Run the backend

### Option 1 – IntelliJ (recommended)

1. Open the `backend` folder as a project.
2. Let IntelliJ import it as a Maven project (using `pom.xml`).
3. Run the `main` method in `com.hotel.inventory.InventoryApplication`.

### Option 2 – Command line

```bash
cd "F:\Inventory Management\backend"
mvn spring-boot:run
```

Or double‑click `run-backend.bat` in the `backend` folder.

The API will be available at `http://localhost:8080`.

## Database (H2 in‑memory)

Configured in `src/main/resources/application.yml`:

- URL: `jdbc:h2:mem:inventory`
- User: `sa`
- Password: _(empty)_
- H2 console: `http://localhost:8080/h2-console`

Schema is generated from JPA entities. Initial demo data comes from `data.sql`.

## Main entity

- `InventoryItem` (`com.hotel.inventory.entity.InventoryItem`)
  - `inventoryId` (Long, @Id)
  - `itemName` (String, required)
  - `category` (String, required)
  - `quantity` (int, default 0)
  - `reorderLevel` (int, default 10)
  - `updateStock(int qty)` enforces _no negative stock_.

## REST endpoints

Base path: `/api/inventory`

- `GET /api/inventory` – list all items
- `GET /api/inventory/{id}` – get one item
- `POST /api/inventory` – create item (body: `InventoryItem` JSON)
- `PUT /api/inventory/{id}` – update item (body: `InventoryItem` JSON)
- `DELETE /api/inventory/{id}` – delete item (idempotent)
- `PUT /api/inventory/stock/{id}` – update stock (body: `{"qty": number}`; positive=add, negative=consume)

All endpoints return `ResponseEntity<?>`. Validation and stock‑below‑zero violations return **400 Bad Request** with an error message from `GlobalExceptionHandler`.

