import express from 'express';
import { loginUser, registerUser, updateUserRole, getAllUsers } from '../controllers/authController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);

// Admin-only routes
router.get('/users', protect, getAllUsers);
router.put('/role/:id', protect, updateUserRole);

export default router;
