import { Request, Response } from 'express';
import { handlePurchase } from '../services/purchaseService';
export const postPurchase = async (req: Request, res: Response) => {
  try {
    const result = await handlePurchase(req);
    res.status(result.status).json(result.body);
  } catch (error) {
    console.log('error is:',error);
    res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
  }
};
