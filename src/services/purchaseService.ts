import { Request } from 'express';
import { prisma } from '../db/client';
const MAX_SEATS = 5000;
export const handlePurchase = async (req: Request) => {
  const { quantity } = req.body;
  const idempotencyKey = req.header('Idempotency-Key');

  if (!quantity || quantity < 1 || quantity > 10 || !idempotencyKey) {
    return { status: 400, body: { error: 'INVALID_REQUEST' } };
  }

  const existing = await prisma.purchase.findUnique({ where: { idempotencyKey } });
  if (existing) {
    return { status: 200, body: { success: true } };
  }

  return await prisma.$transaction(async (tx) => {
    const event = await tx.event.findUnique({ where: { id: 1 } });
    if (!event || event.seatsSold + quantity > MAX_SEATS) {
      return { status: 409, body: { error: 'SOLD_OUT' } };
    }

    await tx.event.update({
      where: { id: 1 },
      data: { seatsSold: { increment: quantity } }
    });
    await tx.purchase.create({
      data: { quantity, idempotencyKey }
    });

    return {
      status: 200,
      body: {
        success: true,
        seatsRemaining: MAX_SEATS - (event.seatsSold + quantity)
      }
    };
  });
};
