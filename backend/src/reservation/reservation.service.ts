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

  /**
   * Get all reservations for a specific host's caravans.
   * @param hostId The ID of the host.
   */
  async getReservationsForHost(hostId: string): Promise<Reservation[]> {
    return prisma.reservation.findMany({
      where: {
        caravan: {
          hostId: hostId,
        },
      },
      include: {
        guest: { // Include guest details
          select: { name: true, email: true }
        },
        caravan: { // Include caravan name
          select: { name: true }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Update the status of a reservation.
   * @param reservationId The ID of the reservation.
   * @param status The new status.
   * @param hostId The ID of the host making the request, for authorization.
   */
  async updateReservationStatus(reservationId: string, status: ReservationStatus, hostId: string): Promise<Reservation> {
    // First, find the reservation and include the caravan's hostId for verification
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: {
        caravan: {
          select: { hostId: true },
        },
      },
    });

    if (!reservation) {
      throw new Error('Reservation not found.');
    }

    // Security Check: Verify the person updating the status is the caravan's host
    if (reservation.caravan.hostId !== hostId) {
      throw new Error('Unauthorized: You are not the host of this caravan.');
    }

    return prisma.reservation.update({
      where: {
        id: reservationId,
      },
      data: {
        status: status,
      },
    });
  }
}
