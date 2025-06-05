import express, { static as serveStatic } from 'express';
import { PrismaClient } from '@prisma/client';
import config from './config/setup/envConfig';
import path from 'path';
import { logger, morganLogger } from './utils/logger';

const prisma = new PrismaClient();
const PORT = config.server.port || 7000;

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

app.listen(PORT, () => {
  logger.info(`Server is running at port ${PORT}`);
});
