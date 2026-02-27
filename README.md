# Smart Hotel Management System (Microservices) 🏨

Welcome to the Smart Hotel Management System!
This project uses **Spring Boot** (Backend) and **Next.js** (Frontend).

Please follow these instructions strictly to set up the project on your machine.

---

## 🗄️ 1. Database Setup

We use **MySQL**. Each service has its own database.

### Step 1: Start MySQL
Make sure your MySQL server is running on port `3306`.

### Step 2: Create Databases
Open **MySQL Workbench** or **phpMyAdmin** and run these commands to create empty databases:

```sql
CREATE DATABASE guest_db;       -- For Guest Service
CREATE DATABASE room_db;        -- For Room Management
CREATE DATABASE reservation_db;  -- For Reservation System
CREATE DATABASE resturent_db;    -- For Resturent & Dining
CREATE DATABASE staff_db;        -- For Staff Management
CREATE DATABASE housekeeping_db; -- For Housekeeping management
CREATE DATABASE billing_db;      -- For Billing & Invoicing System
CREATE DATABASE inventory_db;   -- For Inventory & Stock Management

Note: Do NOT create tables manually. The application will create them automatically.

🔑 3. Password Setup (How to create launch.json) 🚨
We do NOT put passwords inside the code. We use an Environment Variable (DB_PASSWORD). You need to configure this in VS Code.

Follow these steps exactly:
Open the project in VS Code.

Click on the Run and Debug icon on the left sidebar (looks like a bug 🐞 with a play button or click on Ctrl + Shift + D shortcut).

Click on the blue link that says "create a launch.json file".

Select "Java" from the list.

VS Code will create a .vscode/launch.json file. Delete everything in that file and paste the following code:

JSON
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "java",
            "name": "Run Guest Service", # change this according to your part ( eg: Run Reservation System ) 
            "request": "launch",
            "mainClass": "com.smarthotel.guest_service.GuestServiceApplication",
            "projectName": "guest-service", # for example
            "env": {
                "DB_PASSWORD": "YOUR_REAL_PASSWORD_HERE"
            }
        },
        {
            "type": "java",
            "name": "Run Inventory Service",
            "request": "launch",
            "mainClass": "com.smarthotel.inventory_service.InventoryServiceApplication",
            "projectName": "inventory-service",
            "env": {
                "DB_PASSWORD": "YOUR_REAL_PASSWORD_HERE"
            }
        }
    ]
}
⚠️ IMPORTANT:
Replace "YOUR_REAL_PASSWORD_HERE" with your actual MySQL password (e.g., 1234, root, or leave it empty "" if you use XAMPP with no password).

🚀 4. How to Run the Backend
Go to the Run and Debug tab (🐞 icon).

In the dropdown menu at the top, select "Run Guest Service".

Click the Green Play Button (▶).

Check the "Debug Console" or "Terminal". If you see Started GuestServiceApplication..., it is working!

🌐 5. How to Run the Frontend
Open a new terminal.

Go to the frontend folder:

Bash
cd 99-frontend-client
Install dependencies (only once):

Bash
npm install
Start the server:

Bash
npm run dev
Open http://localhost:3000

🤝 Git Rules for the Team
Always pull before you push: git pull origin main

Create a new branch for your features.

Do not commit .vscode folder or .env files.

--------------------FRONT END--------------------------------------------------------------------------------------------------------------------------------------------------

1. Primary Brand Color

Use for: Buttons, Active Links, Highlights, Icons.
Tailwind Class: bg-blue-600 / text-blue-600
Hex Code: #2563EB (Royal Blue)

2. Sidebar & Navigation

Use for: Left Sidebar Background, Footer.
Tailwind Class: bg-slate-900
Hex Code: #0F172A (Dark Slate)

3. Page Background

Use for: Main Content Background
Tailwind Class: bg-slate-50
Hex Code: #F8FAFC (Very Light Grey)

4. Text Colors

Headings: text-slate-800 (#1E293B)
Normal Text: text-slate-600 (#475569)
Muted/Small Text: text-slate-400 (#94A3B8)




Happy Coding! 💻
