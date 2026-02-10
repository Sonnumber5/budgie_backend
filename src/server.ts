import dotenv from 'dotenv';
import express, { Request, Response } from 'express'; // Imports express and the Request/Response types for type safety
import cors from 'cors'; // CORS middleware
import helmet from 'helmet'; // Security middleware
import pool from './database';
import authRoutes from './routes/auth.routes';

require("dotenv").config();

const testDatabaseConnection = async () => {
    try {
        const client = await pool.connect(); // Get a client from the pool
        console.log('Database connection successful'); // Log success message
        client.release(); // Release the client back to the pool
    } catch (err) {
        console.error('Database connection failed', err); // Log any errors that occur
    } finally {
        await pool.end(); // Close the pool when done
    }
};

testDatabaseConnection();

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
app.use(helmet());

console.log(process.env.MY_SQL_DB_HOST);

//Application routes
// Root route
app.get('/health', (req: Request, res: Response) => {
    res.send('<h1>Welcome to the Budgie API</h1>').json({ status: 'ok' });
});

// Mount routers 
app.use('/api/auth', authRoutes);

// Start the Express server
app.listen(port, () => {
    console.log(`budgie_API listening at http://localhost:${port}`);
});
