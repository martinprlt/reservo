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
import { sanitizeInput } from './src/middleware/sanitize.js';
import routes from './src/routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.mercadopago.com", "https://fonts.googleapis.com", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      imgSrc: ["'self'", "data:", "https:", "blob:", "https://res.cloudinary.com"],
      frameSrc: ["'self'", "https://www.mercadopago.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

app.use(cors({
  origin: (origin, cb) => {
    // Allow localhost for development, slotifyapp.site for production
    if (!origin || origin.includes('localhost') || origin.endsWith('.slotifyapp.site') || origin === 'https://slotifyapp.site') {
      cb(null, true);
    } else {
      cb(new Error('CORS not allowed'));
    }
  },
  credentials: true,
}));

// Body parsing with size limits
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(morgan('combined', { stream: logger.stream }));

// Input sanitization
app.use(sanitizeInput);

// Health check BEFORE routes
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// API routes
app.use('/api', routes);

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
