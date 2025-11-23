import { PrismaClient, Caravan, User } from '@prisma/client';
import type { Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class CaravanService {
  /**
   * Create a new caravan
   * @param data Caravan data
   * @param hostId The ID of the host user
   */
  async createCaravan(data: Omit<Caravan, 'id' | 'createdAt' | 'updatedAt' | 'hostId'>, hostId: string): Promise<Caravan> {
    // Check if the user is a host
    const host = await prisma.user.findUnique({
      where: { id: hostId },
    });

    if (!host || host.role !== 'HOST') {
      throw new Error('User is not a host.');
    }
    
    const caravanData = {
        ...data,
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
