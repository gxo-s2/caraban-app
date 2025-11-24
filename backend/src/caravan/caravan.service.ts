import { PrismaClient, Caravan, User } from '@prisma/client';
import type { Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// 컨트롤러에서 숫자로 변환하여 보내는 입력 데이터의 타입을 정의합니다.
// (Caravan 타입에서 ID, 날짜, HostId를 제외하고, pricePerDay를 추가했습니다.)
type CaravanCreationData = Omit<Caravan, 'id' | 'createdAt' | 'updatedAt' | 'hostId'>;


export class CaravanService {
  
  /**
   * 단일 카라반을 ID로 조회합니다. (500 에러 해결)
   * @param id 카라반의 UUID (String)
   */
  async getCaravanById(id: string): Promise<Caravan | null> {
    // [수정 완료] 파라미터를 string으로 변경하고, findUnique를 사용합니다.
    return prisma.caravan.findUnique({
      where: { id },
      // 필요한 경우 호스트 정보나 리뷰 등을 include 할 수 있습니다.
    });
  }


  /**
   * Create a new caravan
   * @param data Caravan data (pricePerDay, capacity 등)
   * @param hostId The ID of the host user (string UUID)
   */
  async createCaravan(data: CaravanCreationData, hostId: string): Promise<Caravan> {
    // Check if the user is a host (현재 코드 유지)
    const host = await prisma.user.findUnique({
      where: { id: hostId },
    });

    if (!host || host.role !== 'HOST') {
      throw new Error('User is not a host.');
    }
    
    // images 필드를 Prisma CreateInput에 맞게 처리합니다.
    const caravanData: Prisma.CaravanCreateInput = {
      // images 필드는 프론트엔드에서 배열로 보냈다면 여기에 추가되어야 합니다.
      name: data.name,
      description: data.description,
      location: data.location,
      pricePerDay: data.pricePerDay,
      capacity: data.capacity,
      // images: data.images as string[], // images 필드가 schema에 있다면 필요
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