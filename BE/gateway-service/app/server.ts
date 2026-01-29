import express from 'express';
import httpProxy from 'http-proxy-3';
import cors from 'cors';
import helmet from 'helmet';

import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const app = express();
const port = process.env.GATEWAY_SERVICE_PORT || 3000;

// Create proxy instances with error handling
const authProxy = httpProxy.createProxyServer({ 
  target: 'http://localhost:3001',
  timeout: 30000, // 30 seconds timeout
  proxyTimeout: 30000
});

const userProxy = httpProxy.createProxyServer({ 
  target: 'http://localhost:3002',
  timeout: 30000, // 30 seconds timeout
  proxyTimeout: 30000
});

// Handle proxy errors
authProxy.on('error', (err, _req, res) => {
  console.error('Auth proxy error:', err);
  const response = res as any;
  if (!response.headersSent) {
    response.status(502).json({ error: 'Auth service unavailable' });
  }
});

userProxy.on('error', (err, _req, res) => {
  console.error('User proxy error:', err);
  const response = res as any;
  if (!response.headersSent) {
    response.status(502).json({ error: 'User service unavailable' });
  }
});

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(helmet()); // Add security headers
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.json()); // Parse JSON bodies

// Proxy Services
app.use('/auth', (req, res, next) => {
  authProxy.web(req, res, next);
});

app.use('/users', (req, res, next) => {
  userProxy.web(req, res, next);
});

// Routes
app.get('/', (_req, res) => {
  res.send('Gateway Service Status: OK');
});

app.listen(port, () => {
  console.log(`Gateway service is running on port ${port}`);
});
