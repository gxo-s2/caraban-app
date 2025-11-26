import { ReservationStatus } from '@prisma/client';
import prisma from '../prisma';

/**
 * 예약 생성
 */
export const createReservation = async (data: any) => {
  return await prisma.reservation.create({
    data,
  });
};

/**
 * [핵심] 특정 유저(게스트)의 예약 목록 조회 (Caravan 정보 포함)
 * - 실제 DB에서 데이터를 가져옵니다.
 */
export const getReservationsByUserId = async (userId: string) => {
  console.log(`[Service] DB에서 예약 조회 시도 - UserID: ${userId}`);

  try {
    const reservations = await prisma.reservation.findMany({
      where: {
        guestId: userId,
      },
      include: {
        caravan: true, // 프론트엔드 카드 UI에 필요한 카라반 정보 포함
      },
      // ⚠️ [안전 장치] 스키마에 createdAt 필드가 없을 경우 에러가 발생할 수 있어 잠시 주석 처리함
      // 데이터가 잘 나오면 주석을 해제하세요.
      // orderBy: { createdAt: 'desc' },
    });

    return reservations;
  } catch (error) {
    console.error('🔴 [Service Error] DB 조회 실패:', error);
    throw error;
  }
};

/**
 * [호환성 유지용] getMyReservations
 */
export const getMyReservations = async (userId: string) => {
    return getReservationsByUserId(userId);
};

/**
 * 호스트를 위한 예약 조회 (내 카라반에 들어온 예약)
 */
export const getReservationsForHost = async (hostId: string) => {
  return await prisma.reservation.findMany({
    where: {
      caravan: {
        hostId: hostId,
      },
    },
    include: {
      guest: true,
      caravan: true,
    },
  });
};

/**
 * 예약 상태 업데이트 (승인/거절/취소 등)
 */
export const updateReservationStatus = async (id: string, status: string) => {
  return await prisma.reservation.update({
    where: { id },
    data: {
      // 문자열을 Prisma Enum 타입으로 변환
      status: status as ReservationStatus,
    },
  });
};

/**
 * 예약 ID로 단일 예약 조회 (비회원용)
 */
export const lookupReservation = async (id: string) => {
  const reservation = await prisma.reservation.findUnique({
    where: { id },
    include: {
      caravan: true, // Caravan 정보 포함
    },
  });

  return reservation;
};