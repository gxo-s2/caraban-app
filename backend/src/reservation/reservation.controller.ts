import { Request, Response } from 'express';
import { ReservationService } from './reservation.service';
import { ReservationStatus } from '@prisma/client';

const reservationService = new ReservationService();

export const createReservation = async (req: Request, res: Response) => {
  try {
    const { caravanId, guestId, startDate, endDate } = req.body;

    if (!caravanId || !guestId || !startDate || !endDate) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const newReservation = await reservationService.createReservation(
      caravanId,
      guestId,
      new Date(startDate),
      new Date(endDate)
    );

    res.status(201).json(newReservation);
  } catch (error: any) {
    if (error.message === 'The caravan is already reserved for the selected dates.') {
      return res.status(409).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getMyReservations = async (req: Request, res: Response) => {
  try {
    // In a real app, you would get the guestId from an authenticated user session (e.g., JWT)
    const { guestId } = req.query; 

    if (!guestId) {
      return res.status(400).json({ message: 'guestId query parameter is required.' });
    }

    const reservations = await reservationService.getMyReservations(guestId as string);
    res.status(200).json(reservations);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getReservationsForHost = async (req: Request, res: Response) => {
  try {
    const { hostId } = req.params;
    if (!hostId) {
      return res.status(400).json({ message: 'Host ID is required.' });
    }
    const reservations = await reservationService.getReservationsForHost(hostId);
    res.status(200).json(reservations);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateReservationStatus = async (req: Request, res: Response) => {
  try {
    const { reservationId } = req.params;
    const { status, hostId } = req.body;

    if (!hostId) {
      return res.status(400).json({ message: 'Host ID is required for authorization.' });
    }

    if (!status || !Object.values(ReservationStatus).includes(status)) {
      return res.status(400).json({ message: 'Invalid status provided.' });
    }

    const updatedReservation = await reservationService.updateReservationStatus(reservationId, status, hostId);
    res.status(200).json(updatedReservation);
  } catch (error: any) {
    if (error.message.includes('Unauthorized')) {
      return res.status(403).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};
