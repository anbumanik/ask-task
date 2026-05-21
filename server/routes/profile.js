import express from 'express';
import { getProfile, updateProfile, uploadProfileImage, upload } from '../controllers/profileController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/me',           protect, getProfile);
router.put('/update',       protect, updateProfile);
router.post('/upload-image', protect, upload.single('profileImage'), uploadProfileImage);

export default router;
