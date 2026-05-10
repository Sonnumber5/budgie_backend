Budgie
Budgie is a personal finance app I built to get a better handle on where my money actually goes. It covers income, expenses, budgets, and savings goals — all scoped to a selected month so you can track things over time. The backend is a Node/Express REST API backed by PostgreSQL, and the frontend is a React SPA with its own auth flow.

Repositories
budgie_backend — Node.js/Express REST API
budgie_frontend — React SPA client

Tech Stack
Backend: Node.js 18+, TypeScript, Express 5, PostgreSQL (AWS RDS), JWT via HTTP-only cookies, bcrypt, Helmet, CORS, express-rate-limit, date-fns
Frontend: React 19, TypeScript, Vite 7, React Router, custom CSS, Axios, Context API + custom hooks

Project Structure
Backend (budgie_backend/src/): controllers, services, dao, queries, routes, middleware, types, utils, database.ts, server.ts
Frontend (budgie_frontend/src/): pages, components, context, features, types, utils, assets

Getting Started
You'll need Node.js 18+ and a PostgreSQL database.
Clone budgie_backend, run npm install, and create a .env with your DB credentials, JWT secret, CORS origin, and port. Then run npm run db:init to set up the schema and npm run dev to start the server on port 3001.
For the frontend, clone budgie_frontend, run npm install, point the base URL in /src/data/axios.ts to http://localhost:3001, and run npm run dev.

API
All endpoints except /api/auth/register and /api/auth/login require a valid JWT cookie. Resources include auth, categories, income, expenses, budgets, savings funds, fund transactions, account balances, and default budgets.

Deployment
Configured for Heroku. The backend connects to PostgreSQL over SSL in production and the frontend is served as a static site via the serve package.
