// src/utils/validators.ts
import { z } from 'zod';
export const purchaseSchema = z.object({
  quantity: z.number().min(1).max(10)
});
