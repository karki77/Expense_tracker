import morgan from 'morgan';
import winston from 'winston';
import colors from 'colors';

colors.enable();

const levelColors = {
  info: colors.green,
  error: colors.red,
  warn: colors.yellow,
};

const winstonLogger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.printf(({ level, message, timestamp }) => {
      const colorize = levelColors[level as keyof typeof levelColors];
      return `${timestamp} ${colorize(`[${level}]`)}: ${message}`;
    }),
  ),
  transports: [new winston.transports.Console()],
});

export const logger = {
  info: (message: string) => winstonLogger.info(message),
  error: (message: string | Error) => winstonLogger.error(message),
  warn: (message: string) => winstonLogger.warn(message),
};

export const morganLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
);

export const loggerStream = {
  write: (message: string): void => {
    console.log(message.trim());
  },

  error: (message: string): void => {
    console.error(message.trim());
  },
};
