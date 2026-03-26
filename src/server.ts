import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { authRoutes } from './routes/auth.routes';
import { AuthDAO } from './dao/auth.dao';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { categoryRoutes } from './routes/category.routes';
import { CategoryController } from './controllers/category.controller';
import { CategoryDAO } from './dao/category.dao';
import { CategoryService } from './services/category.service';
import { IncomeDAO } from './dao/income.dao';
import { IncomeService } from './services/income.service';
import { IncomeController } from './controllers/income.controller';
import { incomeRoutes } from './routes/income.routes';
import { ExpenseDAO } from './dao/expense.dao';
import { ExpenseService } from './services/expense.service';
import { ExpenseController } from './controllers/expense.controller';
import { expenseRoutes } from './routes/expense.routes';
import { BudgetDAO } from './dao/budget.dao';
import { BudgetService } from './services/budget.service';
import { BudgetController } from './controllers/budget.controller';
import { budgetRoutes } from './routes/budget.routes';
import { SavingsFundDAO } from './dao/savingsFund.dao';
import { SavingsFundService } from './services/savingsFund.service';
import { SavingsFundController } from './controllers/savingsFund.controller';
import { savingsFundRoutes } from './routes/savingsFund.routes';
import { FundTransactionDAO } from './dao/fundTransaction.dao';
import { FundTransactionService } from './services/fundTransaction.service';
import { FundTransactionController } from './controllers/fundTransaction.controller';
import { fundTransactionRoutes } from './routes/fundTransaction.routes';
import { AccountBalanceDAO } from './dao/accountBalance.dao';
import { AccountBalanceService } from './services/accountBalance.service';
import { AccountBalanceController } from './controllers/accountBalance.controller';
import { accountBalanceRoutes } from './routes/accountBalance.routes';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const port = 3001;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(cookieParser());

// Parses JSON request bodies
app.use(express.json({ limit: '10kb' }));
// Parses URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Add security-related HTTP headers
app.use(helmet());

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { error: 'Too many attempts, please try again later' }
});

// Dependency injection
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
const budgetDAO = new BudgetDAO();
const budgetService = new BudgetService(budgetDAO, categoryDAO, expenseDAO);
const budgetController = new BudgetController(budgetService, categoryService);
const fundTransactionDAO = new FundTransactionDAO();
const savingsFundDAO = new SavingsFundDAO();
const fundTransactionService = new FundTransactionService(fundTransactionDAO, savingsFundDAO);
const fundTransactionController = new FundTransactionController(fundTransactionService);
const savingsFundService = new SavingsFundService(savingsFundDAO, fundTransactionDAO);
const savingsFundController = new SavingsFundController(savingsFundService);
const accountBalanceDAO = new AccountBalanceDAO();
const accountBalanceService = new AccountBalanceService(accountBalanceDAO);
const accountBalanceController = new AccountBalanceController(accountBalanceService);

// Mount routers
app.use('/api/auth', authRoutes(authController));
app.use('/api', categoryRoutes(categoryController), incomeRoutes(incomeController), expenseRoutes(expenseController), budgetRoutes(budgetController), fundTransactionRoutes(fundTransactionController), savingsFundRoutes(savingsFundController), accountBalanceRoutes(accountBalanceController));

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    if (process.env.NODE_ENV !== 'production') {
        console.error(err);
    }
    const isOperational = err.statusCode && err.statusCode < 500;
    const message = isOperational
        ? err.message
        : 'Internal server error';
    res.status(err.statusCode || 500).json({ error: message });
});

app.use('/api/auth', authLimiter, authRoutes(authController));

// Start the Express server
app.listen(port, () => {
    console.log(`budgie_API listening at http://localhost:${port}`);
});
