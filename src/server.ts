import express, { Application } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
//app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// Test route
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});