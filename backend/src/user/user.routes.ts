// backend/src/user/user.routes.ts 파일 수정

import { Router } from 'express';
// 🚨 [핵심 수정] import 함수명의 대소문자를 router.post의 함수명과 일치시킵니다.
import { signUp, logIn, getUser, updateUser } from './user.controller';
// 만약 위의 경로가 실패한다면 (이전 대화 참고), 아래 경로를 사용하세요:
// import { signUp, login, getUser, updateUser } from '../controllers/user.controller'; 

const router = Router();

// Authentication
router.post('/signup', signUp); // signUp (대소문자 일치)
router.post('/login', logIn);   // logIn (대소문자 일치)

// User Profile
router.get('/:id', getUser);
router.patch('/:id', updateUser);

export default router;