e# Budgie — Backend API

A RESTful API for the Budgie personal finance application. Built with **Node.js**, **Express**, and **TypeScript**, backed by a **PostgreSQL** database.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Server](#running-the-server)
- [API Reference](#api-reference)
- [Authentication](#authentication)
- [Security](#security)
- [Architecture](#architecture)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js ≥ 18 |
| Framework | Express 5 |
| Language | TypeScript 5 |
| Database | PostgreSQL |
| Authentication | JWT + HTTP-only cookies |
| Password Hashing | bcrypt |
| Error Tracking | Sentry |
| Security Headers | Helmet |
| Rate Limiting | express-rate-limit |

---

## Project Structure

```
budgie_backend/
├── src/
│   ├── controllers/      # HTTP request handlers
│   ├── services/         # Business logic
│   ├── dao/              # Database access objects
│   ├── routes/           # Express router definitions
│   ├── middleware/       # Auth middleware
│   ├── queries/          # SQL queries
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Shared utilities
│   ├── database.ts       # PostgreSQL connection pool
│   ├── instrument.ts     # Sentry initialization
│   └── server.ts         # App entry point
├── dist/                 # Compiled JavaScript output
├── .env                  # Environment variables (not committed)
├── nodemon.json
├── tsconfig.json
└── package.json
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [PostgreSQL](https://www.postgresql.org/) v14 or higher
- npm

---

## Installation

```bash
# Clone the repository
git clone https://github.com/Sonnumber5/budgie_backend
cd budgie_backend

# Install dependencies
npm install
```

Create and configure your `.env` file (see [Environment Variables](#environment-variables) below).

Initialize the database schema:

```bash
npm run db:init
```

---

## Environment Variables

Create a `.env` file in the project root with the following keys:

```env
# PostgreSQL connection
DB_USER=your_postgres_username
DB_HOST=localhost
DB_DATABASE=budgie
DB_PASSWORD=your_postgres_password
DB_PORT=5432

# App
NODE_ENV=development
PORT=3001

# Auth — use a long, random string
JWT_SECRET=your_secret_key_here

# CORS — set to your frontend origin
CORS_ORIGIN=http://localhost:5173
```
---

## Running the Server

### Development

```bash
npm run dev
```

The server starts at `http://localhost:3001`.

### Production

```bash
# Compile TypeScript
npm run build

# Start compiled server
npm start
```

---

## API Reference

All endpoints are prefixed with `/api`. All routes except authentication require a valid session cookie (see [Authentication](#authentication)).

### Auth — `/api/auth`

> Rate limited to 50 requests per 15 minutes.

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | No | Create a new user account |
| `POST` | `/api/auth/login` | No | Log in and receive a session cookie |
| `POST` | `/api/auth/logout` | No | Clear the session cookie |
| `GET` | `/api/auth/me` | Yes | Return the current authenticated user |

**Register / Login request body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass1!",
  "name": "Jane Doe"
}
```

Password requirements: minimum 8 characters, at least one uppercase letter, one lowercase letter, one number, and one special character.

---

### Categories — `/api/categories`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/categories` | Create a category |
| `GET` | `/api/categories` | Get all categories for the user |
| `GET` | `/api/categories/:id` | Get a category by ID |
| `PUT` | `/api/categories/:id` | Update a category |

---

### Income — `/api/income`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/income` | Create an income entry |
| `GET` | `/api/income` | Get all income entries for the user |
| `GET` | `/api/income/total` | Get total income for the current month |
| `GET` | `/api/income/:id` | Get an income entry by ID |
| `PUT` | `/api/income/:id` | Update an income entry |
| `DELETE` | `/api/income/:id` | Delete an income entry |

---

### Expenses — `/api/expenses`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/expenses` | Create an expense |
| `GET` | `/api/expenses` | Get all expenses for the user |
| `GET` | `/api/expenses/total` | Get total expenses for the current month |
| `GET` | `/api/expenses/:id` | Get an expense by ID |
| `PUT` | `/api/expenses/:id` | Update an expense |
| `DELETE` | `/api/expenses/:id` | Delete an expense |

---

### Budgets — `/api/budgets`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/budgets/monthly` | Create a monthly budget |
| `GET` | `/api/budgets/monthly` | Get the budget for the current month |
| `GET` | `/api/budgets/monthly/:id` | Get a monthly budget by ID |
| `PUT` | `/api/budgets/monthly/:id` | Update a monthly budget |
| `DELETE` | `/api/budgets/monthly/:id` | Delete a monthly budget |
| `GET` | `/api/budgets/categories/:id` | Get a category budget by ID |
| `PUT` | `/api/budgets/categories/:id` | Update a category budget |
| `DELETE` | `/api/budgets/categories/:id` | Delete a category budget |

---

### Default Budgets — `/api/default-budgets`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/default-budgets` | Save a default budget template |
| `GET` | `/api/default-budgets` | Get the user's default budget |

---

### Savings Funds — `/api/savings-funds`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/savings-funds` | Create a savings fund |
| `GET` | `/api/savings-funds` | Get all savings funds for the user |
| `GET` | `/api/savings-funds/:id` | Get a savings fund by ID |
| `PUT` | `/api/savings-funds/:id` | Update a savings fund |
| `DELETE` | `/api/savings-funds/:id` | Delete a savings fund |
| `PATCH` | `/api/savings-funds/:id/archive` | Archive a savings fund |
| `PATCH` | `/api/savings-funds/:id/unarchive` | Unarchive a savings fund |

---

### Fund Transactions — `/api/savings-funds/:fundId/transactions`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/savings-funds/:fundId/transactions` | Create a transaction for a fund |
| `GET` | `/api/savings-funds/:fundId/transactions` | Get all transactions for a fund |
| `GET` | `/api/savings-funds/transactions` | Get all transactions across all funds |
| `GET` | `/api/savings-funds/contributions` | Get total contributions for the current month |
| `GET` | `/api/savings-funds/:fundId/transactions/:transactionId` | Get a transaction by ID |
| `PUT` | `/api/savings-funds/:fundId/transactions/:transactionId` | Update a transaction |
| `DELETE` | `/api/savings-funds/:fundId/transactions/:transactionId` | Delete a transaction |
| `POST` | `/api/savings-funds/:fundId/transactions/transfer` | Transfer balance between funds |
| `POST` | `/api/savings-funds/:fundId/transactions/adjustment` | Manually adjust a fund balance |

---

### Account Balances — `/api/account-balances`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/account-balances` | Create an account balance record |
| `GET` | `/api/account-balances` | Get all account balances for the user |
| `PUT` | `/api/account-balances` | Reset all account balances |
| `GET` | `/api/account-balances/:id` | Get an account balance by ID |
| `PUT` | `/api/account-balances/:id` | Update an account balance |
| `DELETE` | `/api/account-balances/:id` | Delete an account balance |

---

## Authentication

Authentication uses **JWT tokens stored in HTTP-only cookies**, which prevents client-side JavaScript from accessing the token.

1. Call `POST /api/auth/login` with valid credentials.
2. The server sets a `token` cookie (expires in 24 hours).
3. All subsequent requests automatically include the cookie — no `Authorization` header needed.
4. Call `POST /api/auth/logout` to clear the cookie.

In production (`NODE_ENV=production`), the cookie is flagged `Secure` and will only be sent over HTTPS.

---

## Security

| Feature | Implementation |
|---|---|
| Rate limiting | Auth endpoints are limited to 50 requests / 15 min per IP |
| CORS | Restricted to the origin specified by `CORS_ORIGIN` |
| Password hashing | `bcrypt` with salt rounds |
| Request size limit | JSON bodies capped at 10 KB |
| Error exposure | Stack traces are suppressed in production responses |

---

## Architecture

The backend follows a layered architecture with manual dependency injection:

```
Request → Router → Controller → Service → DAO → Database
```

- **Controller** — validates the HTTP request and formats the response.
- **Service** — contains business logic; coordinates across multiple DAOs when needed.
- **DAO (Data Access Object)** — executes parameterized SQL queries against the database.

Dependencies are composed in `server.ts` and injected downward, keeping each layer independently testable.
