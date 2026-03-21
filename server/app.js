import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import env from './src/config/env.js';
import logger from './src/utils/logger.js';
import errorHandler from './src/middleware/errorHandler.js';
import routes from './src/routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(cors({
  origin: (origin, cb) => cb(null, true),
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('combined', { stream: logger.stream }));

// API routes
app.use('/api', routes);
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Serve static files from client build
const clientDist = path.join(__dirname, '../client/dist');
app.use(express.static(clientDist));

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(clientDist, 'index.html'));
  }
});

app.use(errorHandler);

export default app;
