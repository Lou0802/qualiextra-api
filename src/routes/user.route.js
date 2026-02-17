import express from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { isAdmin } from '../middlewares/role.middleware.js';
import {
  getAllUsers,
  getUserById,
  updateUser,
  getMyProfile,
  updateMyProfile,
  deleteUser
} from '../controllers/user.controller.js';

const router = express.Router();

/* ================= USER ROUTES (mettre AVANT :id) ================= */

/**
 * @openapi
 * /api/users/me:
 *   get:
 *     summary: Récupérer le profil de l'utilisateur authentifié
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Profil utilisateur
 */
router.get('/me', isAuthenticated, getMyProfile);

/**
 * @openapi
 * /api/users/me:
 *   put:
 *     summary: Mettre à jour le profil de l'utilisateur authentifié
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Profil mis à jour
 */
router.put('/me', isAuthenticated, updateMyProfile);

/* ================= ADMIN ROUTES ================= */

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Récupérer tous les utilisateurs (admin)
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Liste des utilisateurs
 */
router.get('/', isAuthenticated, isAdmin, getAllUsers);

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: Récupérer un utilisateur par id (admin)
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Utilisateur trouvé
 */
router.get('/:id', isAuthenticated, isAdmin, getUserById);

/**
 * @openapi
 * /api/users/{id}:
 *   put:
 *     summary: Mettre à jour un utilisateur (admin)
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Utilisateur mis à jour
 */
router.put('/:id', isAuthenticated, isAdmin, updateUser);

/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur (admin)
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Utilisateur supprimé
 */
router.delete('/:id', isAuthenticated, isAdmin, deleteUser);

export default router;