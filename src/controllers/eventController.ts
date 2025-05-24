import { Request, Response } from 'express';
import { getEventStats } from '../services/eventService';
export const getEvent = async (req: Request, res: Response) => {
  const stats = await getEventStats();
  res.json(stats);
};
