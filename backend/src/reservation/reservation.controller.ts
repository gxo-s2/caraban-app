import { Request, Response } from 'express';
// ✅ 서비스 함수들을 다시 연결합니다.
import * as reservationService from './reservation.service';

/**
 * [내 예약 조회] GET /api/reservations/user/:userId
 * - 실제 DB 데이터를 가져옵니다.
 */
export const getUserReservations = async (req: Request, res: Response) => {
  const { userId } = req.params;

  console.log(`📡 [Real Mode] 예약 조회 요청 - UserID: ${userId}`);

  try {
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    // 서비스 호출 (실제 DB 조회)
    const reservations = await reservationService.getReservationsByUserId(userId);

    console.log(`✅ [Controller] 조회 완료: ${reservations.length}건`);

    // 데이터가 없으면 빈 배열 [] 반환
    res.status(200).json(reservations || []);

  } catch (error: any) {
    console.error('🔥 [Controller Error] DB 조회 중 오류:', error);
    res.status(500).json({
      message: '서버 내부 오류가 발생했습니다.',
      error: error.message
    });
  }
};

/**
 * 예약 생성
 */
export const createReservation = async (req: Request, res: Response) => {
  try {
    const { caravanId, guestId, startDate, endDate } = req.body;

    // 유효성 검사
    if (!caravanId || !guestId || !startDate || !endDate) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const newReservation = await reservationService.createReservation({
        caravanId,
        guestId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
    });

    res.status(201).json(newReservation);
  } catch (error: any) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ message: 'Failed to create reservation' });
  }
};

/**
 * 호스트 예약 조회
 */
export const getHostReservations = async (req: Request, res: Response) => {
  try {
    const { hostId } = req.params;
    const reservations = await reservationService.getReservationsForHost(hostId);
    res.status(200).json(reservations);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * 예약 상태 업데이트
 */
export const updateReservationStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedReservation = await reservationService.updateReservationStatus(id, status);
    res.status(200).json(updatedReservation);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * 비회원 예약 조회
 */
export const lookupReservation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const reservation = await reservationService.lookupReservation(id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found.' });
    }

    res.status(200).json(reservation);
  } catch (error: any) {
    console.error('Error looking up reservation:', error);
    res.status(500).json({ message: 'Failed to look up reservation.' });
  }
};