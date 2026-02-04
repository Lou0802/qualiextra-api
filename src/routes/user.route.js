import express from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { isAdmin } from '../middlewares/role.middleware.js';
import { getAllUsers,  getUserById, updateUser, getMyProfile, deleteUser } from '../controllers/user.controller.js';

const router = express.Router();

// Admin routes
router.get('/users', isAuthenticated, isAdmin, getAllUsers);
router.get('/users/:id', isAuthenticated, isAdmin, getUserById);
router.put('/users/:id', isAuthenticated, isAdmin, updateUser);
router.delete('/users/:id', isAuthenticated, isAdmin, deleteUser);

// User route
router.get('/me', isAuthenticated, getMyProfile);

export default router;