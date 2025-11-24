import { Request, Response, Router } from 'express';
import { UserService } from './user.service';
import { Role, User } from '@prisma/client';
import bcrypt from 'bcryptjs'; // 비밀번호 비교용 라이브러리

const router = Router();
const userService = new UserService();

// 1. 회원가입 (경로 수정 완료)
// 🚨 [수정 완료] '/register' -> '/signup'으로 변경 (프론트엔드와 경로 통일)
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { email, password, name, contactNumber, profilePicture, role } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, password, and name are required.' });
    }

    // Role 유효성 검사
    if (role && !Object.values(Role).includes(role)) {
      return res.status(400).json({ message: `Invalid role: ${role}. Must be one of ${Object.values(Role).join(', ')}.` });
    }

    // 이미 존재하는 유저 확인
    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }

    const userData = {
      email,
      password,
      name,
      contactNumber: contactNumber || null,
      profilePicture: profilePicture || null,
      role: role || Role.GUEST,
      isVerified: false 
    };

    const newUser = await userService.createUser(userData);
    
    // 비밀번호는 응답에서 제외
    const { password: _, ...userWithoutPassword } = newUser as User;
    res.status(201).json(userWithoutPassword);

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// 2. 로그인
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // 유저 찾기
    const user = await userService.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 비밀번호 비교
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 로그인 성공!
    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;