import Express from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { User } from '../models/user.model.js';

const router = Express.Router();

// Exemple de route privée protégée par le middleware d'authentification
/**
 * @openapi
 * /api/private:
 *   get:
 *     summary: Route privée exemple
 *     tags:
 *       - Private
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Message de bienvenue
 */
router.get('/private', isAuthenticated, async (req, res) => {
	const user = await User.findByPk(req.user.id);
	res.json({ message: `Hello, ${user.firstname} !` });
});

export default router;
