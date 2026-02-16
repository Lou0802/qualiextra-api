import express from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { isAdmin } from '../middlewares/role.middleware.js';
import { getAllUsers, getUserById, updateUser, getMyProfile, updateMyProfile, deleteUser } from '../controllers/user.controller.js';

const router = express.Router();

/* Admin routes */
router.get('/', isAuthenticated, isAdmin, getAllUsers);       // /api/users
router.get('/:id', isAuthenticated, isAdmin, getUserById);    // /api/users/:id
router.put('/:id', isAuthenticated, isAdmin, updateUser);     // /api/users/:id
router.delete('/:id', isAuthenticated, isAdmin, deleteUser);  // /api/users/:id

/* User routes */
router.get('/me', isAuthenticated, getMyProfile);   // /api/users/me
router.put('/me', isAuthenticated, updateMyProfile); // /api/users/me

export default router;