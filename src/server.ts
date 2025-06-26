import path from 'path';
import { PrismaClient } from '@prisma/client';
import express, { static as serveStatic } from 'express';

import envConfig from './config/setup/envConfig';
import { logger, morganLogger } from './utils/logger';
import appRouter from './router';
import globalErrorHandler from './middleware/globalErrorHandler';

const prisma = new PrismaClient();
const PORT = envConfig.server.port || 7000;

const app = express();

const projectRoot = path.join(__dirname, '..');
const uploadsPath = path.join(projectRoot, 'uploads');
app.use('/uploads', serveStatic(uploadsPath));

// Morgan HTTP request logging
app.use(morganLogger);

void (async (): Promise<void> => {
  try {
    await prisma.$connect();
    logger.info('Database connected successfully.');
  } catch (error) {
    const err = error as Error;
    logger.error(`ERROR CONNECTING DATABASE: ${err.message}`);
    logger.error(err);
    process.exit(1);
  }
})();

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.use('/api/v2', appRouter);

app.use(globalErrorHandler);

app.listen(9000, () => {
  logger.info(`Server is running at 9000 ${9000}`);
});
