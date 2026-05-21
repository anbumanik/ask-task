# StaffSphere - MERN Employee Management Dashboard

A modern, responsive, full-stack Employee Management Dashboard built using the MERN stack (MongoDB, Express, React, Node.js). Styled with an elegant dark glassmorphic theme using Tailwind CSS and interactive data visualization using Recharts.

---

## Features

- **Responsive Design**: Designed for desktop, tablet, and mobile layouts.
- **JWT Authentication**: Secure login portal with password hashing via `bcryptjs` and route protection.
- **KPI Metrics Cards**: Highlights Total Employees, Active count, Inactive count, and top staffing department.
- **Analytics Visuals**: Includes Line chart (hiring history), Bar chart (department headcounts), and Pie chart (distribution ratio).
- **CRUD Operations**: Form controls to Add and Edit employees with custom client-side validation, and a delete confirmation dialog.
- **Dynamic Search & Filters**: Debounced search query (400ms) with filters for both department and employment status.
- **Pagination**: Supports paginated table rows with clean, clickable page index controls.

---

## Directory Structure

```
d:/ask task/
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI elements (Navbar, Sidebar, Modals, StatCard, Loaders)
│   │   ├── context/        # React Context providers (AuthContext, ToastContext)
│   │   ├── hooks/          # Custom hooks (useDebounce)
│   │   ├── pages/          # Primary views (Login, Dashboard, EmployeeList)
│   │   ├── routes/         # Router guard components (ProtectedRoute)
│   │   ├── services/       # Axios API client setup
│   │   ├── index.css       # Styling & Glassmorphic variables
│   │   ├── App.jsx         # App router layouts
│   │   └── main.jsx        # App entry point
│   ├── tailwind.config.js
│   └── vite.config.js
└── server/                 # Express Backend (Node.js)
    ├── config/             # DB configuration (db.js)
    ├── controllers/        # Route controllers (authController, employeeController)
    ├── middleware/         # Custom middlewares (authMiddleware)
    ├── models/             # Mongoose schemas (User, Employee)
    ├── routes/             # Express routing (auth, employees)
    ├── seed.js             # Seed script for mock data
    └── server.js           # Server entry point
```

---

## Setup Instructions

### 1. Configure Environment Variables

Open `server/.env` and configure your database URI:
- **Atlas MongoDB**: Replace the `MONGO_URI` value with your personal MongoDB Atlas connection string:
  ```env
  MONGO_URI=mongodb+srv://<username>:<password>@<your-cluster>.mongodb.net/employee_dashboard?retryWrites=true&w=majority
  ```
- **Local MongoDB**: If running local MongoDB, keep the localhost connection:
  ```env
  MONGO_URI=mongodb://127.0.0.1:27017/employee_dashboard
  ```

### 2. Seed the Database

Run the database seeder to initialize the Admin credentials (`admin@dashboard.com` / `admin123`) and create 22 realistic employee records for analytics testing.

Open a terminal in the `server/` directory and execute:
```bash
npm run seed
```

### 3. Run the Backend Server

To start the development API server (runs on `http://localhost:5000` with hot reloading):
```bash
npm run dev
```

### 4. Run the Frontend Server

To start the Vite dev server (runs on `http://localhost:3000` with proxy mapping `/api` to the backend):

Open a separate terminal in the `client/` directory and execute:
```bash
npm run dev
```

Open your browser and navigate to: `http://localhost:3000`

---

## Test Credentials

Use these seeded admin credentials to login:
- **Email**: `admin@dashboard.com`
- **Password**: `admin123`
