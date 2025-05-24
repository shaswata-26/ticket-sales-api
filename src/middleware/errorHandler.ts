import { Request, Response, NextFunction } from 'express';
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('error is:',err);
  res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
};
