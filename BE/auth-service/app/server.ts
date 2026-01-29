import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

import authRoutes from '../routes/index';
import { errorHandler, notFoundHandler } from '../middlewares/error.middleware';

const app = express();
const port = process.env.AUTH_SERVICE_PORT || 3001;

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(helmet()); // Add security headers
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/auth', authRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.get('/', (_req, res) => {
  res.send('Auth Service Status: OK');
});

app.listen(port, () => {
  console.log(`Auth Service is running on port ${port}`);
});
