import { prisma } from '../db/client';
export const getEventStats = async () => {
  const event = await prisma.event.findUnique({ where: { id: 1 } });
  return {
    totalSeats: event?.totalSeats || 0,
    seatsSold: event?.seatsSold || 0,
    seatsRemaining: (event?.totalSeats || 0) - (event?.seatsSold || 0)
  };
};