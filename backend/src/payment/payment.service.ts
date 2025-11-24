import { PrismaClient, Payment, ReservationStatus, PaymentMethod, PaymentStatus } from '@prisma/client';

const prisma = new PrismaClient();

export class PaymentService {
  
  /**
   * Process a new payment and update the reservation status.
   * @param reservationId The ID of the reservation to pay for.
   * @param method The payment method.
   * @returns Payment 객체
   */
  async processPayment(reservationId: string, method: PaymentMethod): Promise<Payment> {
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      // 결제 금액의 정확성을 위해 totalPrice 필드만 선택적으로 가져올 수 있습니다.
      select: { id: true, totalPrice: true, status: true, guestId: true } 
    });

    if (!reservation) {
      throw new Error('Reservation not found.');
    }

    // PENDING 상태 확인 (필수)
    if (reservation.status !== 'PENDING') {
      throw new Error('Reservation is not in a pending state.');
    }

    // 1. 결제 기록 생성
    const payment = await prisma.payment.create({
      data: {
        amount: reservation.totalPrice,
        method: method,
        status: PaymentStatus.COMPLETED,
        reservation: { connect: { id: reservationId } },
        // [참고] 결제 시뮬레이션이므로, 실제 트랜잭션 ID는 생략
      },
    });

    // 2. 예약 상태를 CONFIRMED로 업데이트
    await prisma.reservation.update({
      where: { id: reservationId },
      data: { status: ReservationStatus.CONFIRMED },
    });

    return payment;
  }

  /**
   * Get all payments for a specific user (Guest).
   * @param userId The ID of the user (Guest).
   * @returns Payment[] (결제 이력 배열)
   */
  async getMyPayments(userId: string): Promise<Payment[]> {
    return prisma.payment.findMany({
      where: {
        reservation: {
          guestId: userId, // 예약의 guestId가 요청한 userId와 일치하는 결제 기록만 필터링
        },
      },
      include: {
        reservation: {
          include: {
            caravan: true, // 결제 이력 테이블에 카라반 이름 표시를 위해 포함
          },
        },
      },
      orderBy: {
        // [수정] paymentDate 대신 Prisma의 기본 생성일 필드인 createdAt을 사용하도록 가정
        createdAt: 'desc', 
      }
    });
  }
}