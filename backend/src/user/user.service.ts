import { PrismaClient, User, Role } from '@prisma/client';
import type { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export class UserService {
  async createUser(userData: Prisma.UserCreateInput): Promise<Omit<User, 'password'>> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findUserById(id: string): Promise<Omit<User, 'password'> | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) return null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Get a user's profile information by their ID.
   * @param userId The ID of the user.
   */
  async getUserProfile(userId: string): Promise<Partial<User> | null> {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        contactNumber: true,
        role: true,
        isVerified: true,
        // Assuming 'rating' is not a direct field but calculated,
        // or needs to be added to the schema.
        // For now, we omit it as per the instructions.
      },
    });
  }

  /**
   * Update a user's profile information.
   * @param userId The ID of the user to update.
   * @param data The data to update (name and/or contactNumber).
   */
  async updateUserProfile(
    userId: string,
    data: { name?: string; contactNumber?: string }
  ): Promise<Partial<User>> {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: data,
      select: {
        id: true,
        email: true,
        name: true,
        contactNumber: true,
        role: true,
        isVerified: true,
      },
    });
    return updatedUser;
  }
}
