import { Request } from 'express';
import { Prisma, PrismaClient } from '../generated/prisma';
import { prisma } from '../db/client';

const MAX_SEATS = 5000;
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 200;
const TRANSACTION_TIMEOUT = 30000; // 30 seconds

export const handlePurchase = async (req: Request) => {
  const { quantity } = req.body;
  const idempotencyKey = req.header('Idempotency-Key');

  // Input validation
  if (!quantity || quantity < 1 || quantity > 10 || !idempotencyKey) {
    return { status: 400, body: { error: 'INVALID_REQUEST' } };
  }

  // Idempotency check
  try {
    const existing = await prisma.purchase.findUnique({ 
      where: { idempotencyKey },
      select: { id: true } // Only select what we need
    });
    if (existing) {
      return { status: 200, body: { success: true } };
    }
  } catch (error) {
    console.error('Idempotency check failed:', error);
    return { status: 500, body: { error: 'SERVER_ERROR' } };
  }

  // Transaction with retry logic
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await prisma.$transaction(async (tx: PrismaClient) => {
        const event = await tx.event.findUnique({
          where: { id: 1 },
          select: { seatsSold: true } // Optimize query
        });

        if (!event || event.seatsSold + quantity > MAX_SEATS) {
          return { status: 409, body: { error: 'SOLD_OUT' } };
        }

        const [updatedEvent] = await Promise.all([
          tx.event.update({
            where: { id: 1 },
            data: { seatsSold: { increment: quantity } }
          }),
          tx.purchase.create({
            data: { quantity, idempotencyKey }
          })
        ]);

        return {
          status: 200,
          body: {
            success: true,
            seatsRemaining: MAX_SEATS - updatedEvent.seatsSold
          }
        };
      }, {
        timeout: TRANSACTION_TIMEOUT,
        maxWait: 15000, // 15 seconds to acquire connection
        isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted
      });
    } catch (error: unknown) {
      if (isRetryableError(error) && attempt < MAX_RETRIES) {
        const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      console.error('Transaction failed:', error);
      return {
        status: 500,
        body: { 
          error: 'TRANSACTION_FAILED',
          attempt,
          ...(error instanceof Error && { message: error.message })
        }
      };
    }
  }
};

// Helper function for error type checking
function isRetryableError(error: unknown): boolean {
  if (typeof error === 'object' && error !== null) {
    const prismaError = error as { code?: string };
    return prismaError.code === 'P2028'; // Transaction timeout
  }
  return false;
}