import dotenv from 'dotenv';
import express, { Request, Response } from 'express'; // Imports express and the Request/Response types for type safety
import cors from 'cors'; // CORS middleware
import helmet from 'helmet'; // Security middleware
import pool from './database';
import { authRoutes } from './routes/auth.routes';
import { AuthDAO } from './database_access/auth.dao';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';

require("dotenv").config();

dotenv.config();

const app = express(); // Creates an instance of an Express application
const port = 3001; // Sets the port number for the app to listen on

// Enable CORS for all requests
app.use(cors());

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

console.log(process.env.MY_SQL_DB_HOST);

//Application routes
// Root route
app.get('/health', (req: Request, res: Response) => {
    res.send('<h1>Welcome to the Budgie API</h1>').json({ status: 'ok' });
});

// Mount routers 
app.use('/api/auth', authRoutes(authController));

// Start the Express server
app.listen(port, () => {
    console.log(`budgie_API listening at http://localhost:${port}`);
});
