import { Request, Response } from 'express';
import { ReviewService } from './review.service';

const reviewService = new ReviewService();

export const createReview = async (req: Request, res: Response) => {
  try {
    const { userID, caravanId, rating, comment } = req.body;

    if (!userID || !caravanId || rating === undefined || !comment) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }
    
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be a number between 1 and 5.' });
    }

    const newReview = await reviewService.createReview(userID, caravanId, rating, comment);
    res.status(201).json(newReview);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getReviewsForCaravan = async (req: Request, res: Response) => {
  try {
    const { caravanId } = req.params;

    if (!caravanId) {
      return res.status(400).json({ message: 'Caravan ID is required.' });
    }

    const reviews = await reviewService.getReviewsForCaravan(caravanId);
    res.status(200).json(reviews);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
