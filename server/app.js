import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import env from './src/config/env.js';
import logger from './src/utils/logger.js';
import errorHandler from './src/middleware/errorHandler.js';
import routes from './src/routes/index.js';

const app = express();

app.use(helmet());
app.use(cors({
  origin: (origin, cb) => cb(null, true),
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('combined', { stream: logger.stream }));

app.use('/api', routes);
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);

export default app;
