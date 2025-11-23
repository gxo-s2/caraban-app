import { Request, Response, Router } from 'express';
import { UserService } from './user.service';
import { Role } from '@prisma/client';

const router = Router();
const userService = new UserService();

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name, contactNumber, profilePicture, role } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, password, and name are required.' });
    }

    // Validate role if provided
    if (role && !Object.values(Role).includes(role)) {
      return res.status(400).json({ message: `Invalid role: ${role}. Must be one of ${Object.values(Role).join(', ')}.` });
    }

    // Check if user already exists
    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }

    // Construct user data based on what's provided in the request
    const userData = {
      email,
      password,
      name,
      contactNumber,
      profilePicture,
      role
    };

    const newUser = await userService.createUser(userData);
    res.status(201).json(newUser);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Implement login and profile routes later
// router.post('/login', async (req: Request, res: Response) => { ... });
// router.get('/profile/:id', async (req: Request, res: Response) => { ... });

export default router;
