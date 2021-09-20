import winston from 'winston';
import { argv } from '../argv';

export const logger = winston.createLogger({
  level: argv['log-level'] || 'info',
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
});
