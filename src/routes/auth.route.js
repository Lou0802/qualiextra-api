import express from 'express';
import { register, login, verifyEmail } from '../controllers/auth.controller.js';

const router =express.Router();

// je recupere la fonction register du controller
router.post ('/register', register);
// je recupere la fonction login du controller
router.post ('/login', login);
// je recupere la fonction verifyEmail du controller
router.get('/verify-email', verifyEmail);

export default router;