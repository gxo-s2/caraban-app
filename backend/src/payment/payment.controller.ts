import { Request, Response } from 'express';
import { PaymentService } from './payment.service';
import { PaymentMethod } from '@prisma/client';

const paymentService = new PaymentService();

/**
 * 새 결제를 처리하고 예약 상태를 업데이트합니다.
 * (POST /api/payments)
 */
export const createPayment = async (req: Request, res: Response) => {
  try {
    const { reservationId, method } = req.body;

    if (!reservationId || !method) {
      return res.status(400).json({ message: 'Missing required fields: reservationId, method.' });
    }

    if (!Object.values(PaymentMethod).includes(method)) {
      return res.status(400).json({ message: `Invalid payment method: ${method}.` });
    }

    const newPayment = await paymentService.processPayment(reservationId, method);
    res.status(201).json(newPayment);
  } catch (error: any) {
    if (error.message.includes('not found') || error.message.includes('not in a pending state')) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

/**
 * 사용자 ID를 기반으로 결제 이력 목록을 조회합니다.
 * (GET /api/payments?userId=...)
 */
export const getMyPayments = async (req: Request, res: Response) => {
  try {
    // 프론트엔드에서 쿼리 파라미터로 userId를 받습니다.
    const { userId } = req.query;

    // [중요] userId는 string (UUID)으로 예상되므로 타입 캐스팅 필요
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ message: 'userId query parameter is required and must be a string.' });
    }

    const payments = await paymentService.getMyPayments(userId);
    res.status(200).json(payments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};