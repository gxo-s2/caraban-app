import { Request, Response } from 'express';
import { CaravanService } from './caravan.service';
import { Caravan } from '@prisma/client'; 

const caravanService = new CaravanService();

// --- 1. 단일 카라반 상세 조회 ---
export const getCaravanById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; 
    
    // 서비스 레이어의 비동기 함수를 호출합니다. (ID는 문자열로 전달)
    const caravan = await caravanService.getCaravanById(id); 

    // [최종 수정] null 체크로 404 처리
    if (caravan == null) { 
      return res.status(404).json({ message: 'Caravan not found.' });
    }
    
    // 성공 시 200과 함께 데이터 반환
    res.status(200).json(caravan);
  } catch (error: any) {
    // 조회 중 서버 에러 발생 시 500 반환 (서비스/DB 오류)
    res.status(500).json({ message: 'Error fetching caravan details.' });
  }
};


// --- 2. 카라반 생성 ---
export const createCaravan = async (req: Request, res: Response) => {
  try {
    const { name, description, location, pricePerDay, capacity, hostId } = req.body;

    // 필수 값 누락 체크 (400 Bad Request)
    if (!name || !description || !location || !pricePerDay || !capacity || !hostId) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const newCaravan = await caravanService.createCaravan({
      name,
      description,
      location,
      pricePerDay: Number(pricePerDay), 
      capacity: Number(capacity),       
    }, hostId);

    res.status(201).json(newCaravan);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


// --- 3. 전체 카라반 목록 조회 ---
export const getAllCaravans = async (req: Request, res: Response) => {
  try {
    const allCaravans = await caravanService.getAllCaravans();
    res.status(200).json(allCaravans);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};