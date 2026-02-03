import express from 'express';
import { register, login } from '../controllers/auth.controller.js';

const router =express.Router();

// je recupere la fonction register du controller
router.post ('/register', register);
// je recupere la fonction login du controller
router.post ('/login', login);

export default router;