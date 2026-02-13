import express from 'express';
import { register, login, verifyEmail } from '../controllers/auth.controller.js';

const router =express.Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Enregistrer un nouvel utilisateur
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       '201':
 *         description: Utilisateur créé
 */
router.post ('/register', register);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Connexion utilisateur
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       '200':
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 */
router.post ('/login', login);

/**
 * @openapi
 * /api/auth/verify-email:
 *   get:
 *     summary: Vérifier l'email via token
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: Email vérifié
 */
router.get('/verify-email', verifyEmail);

export default router;