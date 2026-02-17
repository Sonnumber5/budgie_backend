import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet'; 
import pool from './database';
import { authRoutes } from './routes/auth.routes';
import { AuthDAO } from './database_access/auth.dao';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { categoryRoutes } from './routes/category.routes';
import { CategoryController } from './controllers/category.controller';
import { CategoryDAO } from './database_access/category.dao';
import { CategoryService } from './services/category.service';
import { IncomeDAO } from './database_access/income.dao';
import { IncomeService } from './services/income.service';
import { IncomeController } from './controllers/income.controller';
import { IncomeRoutes } from './routes/income.routes';
import { ExpenseDAO } from './database_access/expense.dao';
import { ExpenseService } from './services/expense.service';
import { ExpenseController } from './controllers/expense.controller';
import { ExpenseRoutes } from './routes/expense.routes';
import { MonthlyBudgetDAO } from './database_access/monthlyBudget.dao';
import { MonthlyBudgetService } from './services/monthlyBudget.service';
import { MonthlyBudgetController } from './controllers/monthlyBudget.controller';
import { CategoryBudgetDAO } from './database_access/categoryBudget.dao';
import { CategoryBudgetService } from './services/categoryBudget.service';
import { CategoryBudgetController } from './controllers/categoryBudget.controller';
import { MonthlyBudgetRoutes } from './routes/monthlyBudget.routes';
import { CategoryBudgetRoutes } from './routes/categoryBudget.routes';

require("dotenv").config();

dotenv.config();

const app = express(); // Creates an instance of an Express application
const port = 3001; // Sets the port number for the app to listen on

// Enable CORS for all requests
app.use(cors());

app.use(cookieParser());  

// Parses JSON request bodies
app.use(express.json());
// Parses URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Add security-related HTTP headers
//app.use(helmet());

//dependency injection
const authDAO = new AuthDAO();
const authService = new AuthService(authDAO);
const authController = new AuthController(authService);
const categoryDAO = new CategoryDAO();
const categoryService = new CategoryService(categoryDAO);
const categoryController = new CategoryController(categoryService);
const incomeDAO = new IncomeDAO();
const incomeService = new IncomeService(incomeDAO);
const incomeController = new IncomeController(incomeService);
const expenseDAO = new ExpenseDAO();
const expenseService = new ExpenseService(expenseDAO, categoryDAO);
const expenseController = new ExpenseController(expenseService, categoryService);
const monthlyBudgetDAO = new MonthlyBudgetDAO();
const monthlyBudgetService = new MonthlyBudgetService(monthlyBudgetDAO, categoryDAO);
const monthlyBudgetController = new MonthlyBudgetController(monthlyBudgetService);
const categoryBudgetDAO = new CategoryBudgetDAO();
const categoryBudgetService = new CategoryBudgetService(categoryBudgetDAO);
const categoryBudgetController = new CategoryBudgetController(categoryBudgetService);


console.log(process.env.MY_SQL_DB_HOST);

//Application routes
// Root route
app.get('/health', (req: Request, res: Response) => {
    res.send('<h1>Welcome to the Budgie API</h1>').json({ status: 'ok' });
});

// Mount routers 
app.use('/api/auth', authRoutes(authController));
app.use('/api', categoryRoutes(categoryController), IncomeRoutes(incomeController), ExpenseRoutes(expenseController), MonthlyBudgetRoutes(monthlyBudgetController), CategoryBudgetRoutes(categoryBudgetController));

// Start the Express server
app.listen(port, () => {
    console.log(`budgie_API listening at http://localhost:${port}`);
});
