import { PrismaClient, Reservation, ReservationStatus } from '@prisma/client';

const prisma = new PrismaClient();

export class ReservationService {
  /**
   * Create a new reservation after checking for overlaps.
   * @param caravanId The ID of the caravan to reserve.
   * @param guestId The ID of the user making the reservation.
   * @param startDate The start date of the reservation.
   * @param endDate The end date of the reservation.
   */
  async createReservation(caravanId: string, guestId: string, startDate: Date, endDate: Date): Promise<Reservation> {
    const caravan = await prisma.caravan.findUnique({
      where: { id: caravanId },
    });

    if (!caravan) {
      throw new Error('Caravan not found.');
    }

    // Check for overlapping reservations
    const overlappingReservations = await prisma.reservation.findMany({
      where: {
        caravanId: caravanId,
        status: { in: ['CONFIRMED', 'PENDING'] },
        AND: [
          {
            startDate: {
              lt: endDate,
            },
          },
          {
            endDate: {
              gt: startDate,
            },
          },
        ],
      },
    });

    if (overlappingReservations.length > 0) {
      throw new Error('The caravan is already reserved for the selected dates.');
    }

    // Calculate total price
    const durationInDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
    const totalPrice = durationInDays * caravan.pricePerDay;

    // Create the reservation
    const reservation = await prisma.reservation.create({
      data: {
        startDate,
        endDate,
        totalPrice,
        guest: { connect: { id: guestId } },
        caravan: { connect: { id: caravanId } },
      },
    });

    return reservation;
  }

  /**
   * Get all reservations for a specific user.
   * @param guestId The ID of the user.
   */
  async getMyReservations(guestId: string): Promise<Reservation[]> {
    return prisma.reservation.findMany({
      where: {
        guestId: guestId,
      },
      include: {
        caravan: true, // Include caravan details in the response
      },
    });
  }
}
