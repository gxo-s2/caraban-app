import { PrismaClient, Review } from '@prisma/client';

const prisma = new PrismaClient();

export class ReviewService {
  /**
   * Create a new review for a caravan.
   * @param authorId The ID of the user writing the review.
   * @param caravanId The ID of the caravan being reviewed.
   * @param rating The rating from 1 to 5.
   * @param comment The review comment.
   */
  async createReview(authorId: string, caravanId: string, rating: number, comment: string): Promise<Review> {
    // Optional: Add logic to verify that the user has actually stayed in the caravan (e.g., has a past, confirmed reservation).
    // This is a good practice to prevent fake reviews.

    return prisma.review.create({
      data: {
        rating,
        comment,
        author: { connect: { id: authorId } },
        caravan: { connect: { id: caravanId } },
      },
    });
  }

  /**
   * Get all reviews for a specific caravan.
   * @param caravanId The ID of the caravan.
   */
  async getReviewsForCaravan(caravanId: string): Promise<Review[]> {
    return prisma.review.findMany({
      where: {
        caravanId: caravanId,
      },
      include: {
        author: { // Include author's name and profile picture
          select: {
            name: true,
            profilePicture: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
