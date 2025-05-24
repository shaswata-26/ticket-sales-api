import { Router } from 'express';
import { postPurchase } from '../controllers/purchaseController';
const router = Router();
router.post('/', postPurchase);
export default router;