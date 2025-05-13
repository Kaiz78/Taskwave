import express from 'express';
import { register, login, getProfile, updateProfile, discordAuth, discordCallback } from '../controllers/authController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Routes pour information - retourne un message indiquant que seul Discord est supporté
router.post('/register', register);
router.post('/login', login);

// Routes OAuth
router.get('/discord', discordAuth);
router.get('/discord/callback', discordCallback);

// Routes protégées
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

export default router;
