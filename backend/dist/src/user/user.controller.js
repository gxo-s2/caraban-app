"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_service_1 = require("./user.service");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const userService = new user_service_1.UserService();
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, name, contactNumber, profilePicture, role } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ message: 'Email, password, and name are required.' });
        }
        // Validate role if provided
        if (role && !Object.values(client_1.Role).includes(role)) {
            return res.status(400).json({ message: `Invalid role: ${role}. Must be one of ${Object.values(client_1.Role).join(', ')}.` });
        }
        // Check if user already exists
        const existingUser = yield userService.findUserByEmail(email);
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
        const newUser = yield userService.createUser(userData);
        res.status(201).json(newUser);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
// Implement login and profile routes later
// router.post('/login', async (req: Request, res: Response) => { ... });
// router.get('/profile/:id', async (req: Request, res: Response) => { ... });
exports.default = router;
