import { PrismaClient, Caravan, User } from '@prisma/client';
import type { Prisma } from '@prisma/client';

const prisma = new PrismaClient();

type CaravanCreationData = Omit<Caravan, 'id' | 'createdAt' | 'updatedAt' | 'hostId'>;

export class CaravanService {
  /**
   * 단일 카라반을 ID로 조회하며, 리뷰 평균 및 개수를 포함합니다.
   * @param id 카라반의 UUID (String)
   */
  async getCaravanById(id: string) { // Return type will be inferred
    const caravan = await prisma.caravan.findUnique({
      where: { id },
      include: {
        // 호스트 정보 포함
        host: {
          select: { id: true, name: true, profilePicture: true }
        },
        // 리뷰 정보 집계
        _count: {
          select: { reviews: true },
        },
      },
    });

    if (!caravan) return null;

    // 별점 평균 계산
    const aggregate = await prisma.review.aggregate({
      _avg: {
        rating: true,
      },
      where: {
        caravanId: id,
      },
    });

    return {
      ...caravan,
      reviews_avg: aggregate._avg.rating || 0,
      reviews_count: caravan._count.reviews,
    };
  }

  /**
   * Create a new caravan
   * @param data Caravan data (pricePerDay, capacity 등)
   * @param hostId The ID of the host user (string UUID)
   */
  async createCaravan(data: CaravanCreationData, hostId: string): Promise<Caravan> {
    const host = await prisma.user.findUnique({
      where: { id: hostId },
    });

    if (!host || host.role !== 'HOST') {
      throw new Error('User is not a host.');
    }
    
    const caravanData: Prisma.CaravanCreateInput = {
      name: data.name,
      description: data.description,
      location: data.location,
      pricePerDay: data.pricePerDay,
      capacity: data.capacity,
      images: data.images as string[],
      host: {
        connect: {
          id: hostId
        }
      }
    };

    return prisma.caravan.create({
      data: caravanData,
    });
  }

  /**
   * Get all caravans
   */
  async getAllCaravans(): Promise<Caravan[]> {
    return prisma.caravan.findMany();
  }
}