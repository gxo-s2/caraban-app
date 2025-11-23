import { PrismaClient, Payment, ReservationStatus, PaymentMethod, PaymentStatus } from '@prisma/client';

const prisma = new PrismaClient();

export class PaymentService {
  /**
   * Process a new payment and update the reservation status.
   * @param reservationId The ID of the reservation to pay for.
   * @param method The payment method.
   */
  async processPayment(reservationId: string, method: PaymentMethod): Promise<Payment> {
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
    });

    if (!reservation) {
      throw new Error('Reservation not found.');
    }

    if (reservation.status !== 'PENDING') {
      throw new Error('Reservation is not in a pending state.');
    }

    // In a real-world scenario, you would integrate with a payment gateway (e.g., Stripe, PayPal) here.
    // For this simulation, we'll assume the payment is always successful.

    const payment = await prisma.payment.create({
      data: {
        amount: reservation.totalPrice,
        method: method,
        status: PaymentStatus.COMPLETED,
        reservation: { connect: { id: reservationId } },
      },
    });

    // Update the reservation status to CONFIRMED
    await prisma.reservation.update({
      where: { id: reservationId },
      data: { status: ReservationStatus.CONFIRMED },
    });

    return payment;
  }

  /**
   * Get all payments for a specific user.
   * This requires fetching reservations for the user first.
   * @param userId The ID of the user.
   */
  async getMyPayments(userId: string): Promise<Payment[]> {
    return prisma.payment.findMany({
      where: {
        reservation: {
          guestId: userId,
        },
      },
      include: {
        reservation: {
          include: {
            caravan: true,
          },
        },
      },
      orderBy: {
        paymentDate: 'desc',
      }
    });
  }
}
