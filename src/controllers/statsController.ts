import { Request, Response } from 'express';
import { getSystemStats } from '../services/statsService';
export const getStats = (req: Request, res: Response) => {
  const stats = getSystemStats();
  res.json(stats);
};