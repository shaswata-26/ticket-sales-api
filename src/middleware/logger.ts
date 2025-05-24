import { Request, Response, NextFunction } from 'express';
import { logRequest } from '../services/statsService';
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const latency = Date.now() - start;
    logRequest(latency, res.statusCode < 400);
  });
  next();
};
