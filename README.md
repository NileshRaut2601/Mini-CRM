# Mini CRM (Customer Relationship Management)

A beginner-friendly, end-to-end full-stack Customer Relationship Management (CRM) application built using **React**, **Vite**, **Node.js**, **Express**, and **PostgreSQL**.

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Features](#2-features)
3. [Technology Stack](#3-technology-stack)
4. [Project Structure](#4-project-structure)
5. [PostgreSQL Setup & Prerequisites](#5-postgresql-setup--prerequisites)
6. [Database Creation](#6-database-creation)
7. [Table Creation](#7-table-creation)
8. [Backend Setup](#8-backend-setup)
9. [Frontend Setup](#9-frontend-setup)
10. [Environment Variables](#10-environment-variables)
11. [How to Run the Project](#11-how-to-run-the-project)
12. [API Endpoints Reference](#12-api-endpoints-reference)
13. [Data Flow Explanation (Student & Viva Guide)](#13-data-flow-explanation)
14. [Future Improvements](#14-future-improvements)

---

## 1. Project Overview

The **Mini CRM** allows small businesses or individuals to manage client contact information cleanly and securely. Unlike prototype apps that use in-memory arrays or browser `localStorage`, this system uses **PostgreSQL** as the permanent source of truth and an **Express.js REST API** with connection pooling and parameterized SQL queries to protect against SQL injection vulnerabilities.

---

## 2. Features

- **Full CRUD Operations**:
  - **Create**: Add new customer records with name and email.
  - **Read**: Fetch customer lists ordered by ID.
  - **Update**: Edit existing customer names and emails with prefilled form inputs.
  - **Delete**: Remove customers with a confirmation modal/dialog.
- **Health Check Endpoint**: `/api/health` returns `{ "status": "OK" }` for monitoring and deployment readiness.
- **Client-Side & Server-Side Form Validation**:
  - Full name is required and within 2 to 100 characters.
  - Email is required and checked against standard email format patterns.
- **Real-Time Search**: Filter customers instantly by name or email (case-insensitive) without querying the database on every keystroke.
- **Live Statistics**: Displays total registered customer count and active matching count during search.
- **User Feedback & State Handling**:
  - Interactive loading spinner during asynchronous network requests.
  - Success notifications with auto-dismiss timer.
  - Error alert banners for connection or validation failures.
  - Helpful empty states when the directory is empty or search yields zero results.
- **Clean Portfolio UI**: Responsive card-based layout, modern typography, hover transitions, and mobile-friendly styling using pure CSS.
- **Security-First**:
  - Parameterized queries (`$1, $2, ...`) prevent SQL injection.
  - Credentials stored in `.env`, git-ignored to prevent credential leaks.

---

## 3. Technology Stack

### Frontend
- **React 19**: Component-based user interface using modern functional components and hooks (`useState`, `useEffect`).
- **Vite**: Ultra-fast build tool and local dev server running on port `5174`.
- **CSS**: Pure, vanilla CSS with custom design tokens, responsive flexbox/grid layout, and zero heavy UI libraries.

### Backend
- **Node.js**: JavaScript runtime environment.
- **Express.js**: Lightweight web application framework running on port `3200`.
- **pg (`node-postgres`)**: Official PostgreSQL client featuring connection pooling (`Pool`).
- **CORS**: Cross-Origin Resource Sharing middleware enabling frontend-backend communication.
- **dotenv**: Environment variable management keeping database secrets secure.

### Database
- **PostgreSQL**: Relational database serving as the permanent, single source of truth.

---

## 4. Project Structure

```text
mini-crm/
│
├── backend/
│   ├── .env                 # Database credentials (git-ignored, never committed)
│   ├── .env.example         # Template for required environment variables
│   ├── .gitignore           # Ignores node_modules, .env, and logs
│   ├── db.js                # PostgreSQL connection pool with error listener
│   ├── package.json         # Backend dependencies (express, pg, cors, dotenv)
│   └── server.js            # Express server (Port 3200) with REST endpoints
│
├── frontend/
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── CustomerForm.jsx   # Controlled form for adding and updating
│   │   │   ├── CustomerTable.jsx  # Responsive directory table with actions
│   │   │   ├── SearchBar.jsx      # Real-time search with clear button
│   │   │   └── StatCards.jsx      # Overview metrics and connection status
│   │   ├── api.js           # Centralized fetch API service helper
│   │   ├── App.css          # Application layout and component styling
│   │   ├── App.jsx          # Main dashboard coordinator
│   │   ├── index.css        # Global CSS reset and color tokens
│   │   └── main.jsx         # React application entry point
│   ├── index.html           # HTML template
│   ├── vite.config.js       # Vite configuration (Port 5174)
│   └── package.json         # Frontend dependencies
│
├── .gitignore               # Root gitignore protecting secrets
└── README.md                # Project documentation and guide
```

---

## 5. PostgreSQL Setup & Prerequisites

Make sure PostgreSQL is installed and the service is running on your machine:

- **Default Port**: `5432`
- **Default Superuser**: `postgres`

To verify the PostgreSQL service on Windows:
```powershell
Get-Service -Name *postgres*
```

---

## 6. Database Creation

Open your terminal or `psql` shell:

```sql
CREATE DATABASE mini_crm;
```

Or run directly from the command line:
```bash
psql -U postgres -c "CREATE DATABASE mini_crm;"
```

---

## 7. Table Creation

Connect to the `mini_crm` database and run the table creation script:

```sql
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL
);
```

Or via command line:
```bash
psql -U postgres -d mini_crm -c "CREATE TABLE customers (id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL, email VARCHAR(255) NOT NULL);"
```

---

## 8. Backend Setup

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```

3. Configure your local environment file:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
     *(On Windows PowerShell: `Copy-Item .env.example .env`)*
   - Open `.env` and fill in your PostgreSQL password.

---

## 9. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

---

## 10. Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
| :--- | :--- | :--- |
| `DB_USER` | PostgreSQL username | `postgres` |
| `DB_HOST` | Database host | `localhost` |
| `DB_NAME` | Database name | `mini_crm` |
| `DB_PASSWORD` | Database password | `<your_postgresql_password>` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `PORT` | Express server port | `3200` |

> [!CAUTION]
> Never commit your `.env` file to source control. Ensure `backend/.env` is listed inside `.gitignore`.

---

## 11. How to Run the Project

### Start the Backend Server (Terminal 1)
```bash
cd backend
npm run dev
# OR: node server.js
```
The server will start at: `http://localhost:3200`

### Start the Frontend Dev Server (Terminal 2)
```bash
cd frontend
npm run dev
```
The application will open at: `http://localhost:5174`

---

## 12. API Endpoints Reference

All API routes are served under the `/api` prefix:

| Method | Endpoint | Description | Request Body | Success Status |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service health check | None | `200 OK` |
| `GET` | `/api/customers` | Retrieve all customers | None | `200 OK` |
| `POST` | `/api/customers` | Add a new customer | `{"name": "...", "email": "..."}` | `201 Created` |
| `PUT` | `/api/customers/:id` | Update customer details | `{"name": "...", "email": "..."}` | `200 OK` (or `404`) |
| `DELETE` | `/api/customers/:id` | Delete a customer | None | `200 OK` (or `404`) |

### Example Request & Response Payloads

#### 1. Add Customer (POST `/api/customers`)
**Request Body**:
```json
{
  "name": "Nilesh Raut",
  "email": "nilesh@example.com"
}
```
**Response (201 Created)**:
```json
{
  "id": 1,
  "name": "Nilesh Raut",
  "email": "nilesh@example.com"
}
```

#### 2. Update Customer (PUT `/api/customers/1`)
**Request Body**:
```json
{
  "name": "Nilesh Raut (Updated)",
  "email": "nilesh.updated@example.com"
}
```
**Response (200 OK)**:
```json
{
  "id": 1,
  "name": "Nilesh Raut (Updated)",
  "email": "nilesh.updated@example.com"
}
```

#### 3. Error Response (400 Bad Request)
```json
{
  "error": "A valid email address is required"
}
```

---

## 13. Data Flow Explanation

Here is the exact step-by-step lifecycle of a request to explain during a viva or project demonstration:

```text
[User Interaction in React]
          │
          ▼
[React State & Form Validation]
          │
          ▼
[API Helper Function (api.js)] ─── HTTP Request (fetch) ───►
                                                              │
                                                              ▼
                                                    [Express.js Route (server.js)]
                                                              │
                                                              ▼
                                                    [pg Connection Pool (db.js)]
                                                              │
                                                              ▼
                                                    [PostgreSQL Database (SQL query)]
                                                              │
                                                              ▼
                                                    [PostgreSQL Returns Row(s)]
                                                              │
                                                              ▼
[React UI Updates Automatically] ◄── HTTP Response (JSON) ───┘
```

1. **User Action**: The user submits the form or clicks Delete in the browser UI (`App.jsx`).
2. **Client Validation**: React verifies that fields are filled and match standard patterns.
3. **HTTP Dispatch**: `api.js` fires a `fetch` request to `http://localhost:3200/api/customers`.
4. **Backend Processing**: Express parses JSON body (`express.json()`), validates parameters, and prepares a parameterized SQL query.
5. **Database Execution**: `pg.Pool` sends the parameterized query (e.g. `INSERT INTO customers (name, email) VALUES ($1, $2) RETURNING *;`) to PostgreSQL.
6. **Database Response**: PostgreSQL generates the unique sequential `id` via `SERIAL`, writes the record to disk, and returns the newly inserted row.
7. **JSON Serialization**: Express returns the record with appropriate HTTP status (`201` for create, `200` for update/delete/read).
8. **UI Sync**: React updates its state (`setCustomers(...)`), displays a success toast notification, and resets the input fields.

---

## 14. Future Improvements

- **Pagination**: Implement cursor or offset-based pagination for datasets exceeding thousands of records.
- **Authentication**: Add JWT (JSON Web Token) authentication so each user only sees their own customers.
- **Export to CSV**: Add a button to export customer contacts to a downloadable spreadsheet.
- **Activity Log**: Add a timeline showing when each customer was added or last contacted.

