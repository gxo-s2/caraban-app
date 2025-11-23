import { Request, Response } from 'express';
import { CaravanService } from './caravan.service';
import { Caravan } from '@prisma/client';

const caravanService = new CaravanService();

export const createCaravan = async (req: Request, res: Response) => {
  try {
    const { name, description, location, pricePerDay, capacity, hostId } = req.body;

    if (!name || !description || !location || !pricePerDay || !capacity || !hostId) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const newCaravan = await caravanService.createCaravan({
      name,
      description,
      location,
      pricePerDay,
      capacity,
    }, hostId);

    res.status(201).json(newCaravan);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllCaravans = async (req: Request, res: Response) => {
  try {
    const allCaravans = await caravanService.getAllCaravans();
    res.status(200).json(allCaravans);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
