import { Router } from 'express';
import { getEvent } from '../controllers/eventController';
const router = Router();
router.get('/', getEvent);
export default router;