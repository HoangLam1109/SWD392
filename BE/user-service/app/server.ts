import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

import { initializeDatabase } from '../config';
import userRoutes from '../routes';

const app = express();
const port = process.env.USER_SERVICE_PORT || 3002;

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(helmet()); // Add security headers
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.json()); // Parse JSON bodies

// Database connection
initializeDatabase();

// Routes
app.get('/', (_req, res) => {
  res.send('User Service Status: OK');
});

app.use('/users', userRoutes);

app.listen(port, () => {
  console.log(`User Service is running on port ${port}`);
});
