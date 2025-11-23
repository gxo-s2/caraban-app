import { Request, Response } from 'express';
import { PaymentService } from './payment.service';
import { PaymentMethod } from '@prisma/client';

const paymentService = new PaymentService();

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

export const getMyPayments = async (req: Request, res: Response) => {
  try {
    // In a real app, you would get the userId from an authenticated user session (e.g., JWT)
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: 'userId query parameter is required.' });
    }

    const payments = await paymentService.getMyPayments(userId as string);
    res.status(200).json(payments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
