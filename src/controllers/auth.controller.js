import { User } from '../models/user.model.js';
import argon2 from 'argon2';

// On importe crypto pour générer un token de vérification par email
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

/**
 * Fonction d'inscription d'un utilisateur
 * @param {Object} req - Requête HTTP contenant firstname, lastname, email, password
 * @param {Object} res - Réponse HTTP
 */
export const register = async (req, res) => {
  try {
    // On récupère les champs depuis le corps de la requête
    const { firstname, lastname, email, password } = req.body;

    // Vérification que tous les champs sont fournis
    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires" });
    }

    // Vérification si l'utilisateur existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "L'email est déjà utilisé" });
    }

    // Hashage sécurisé du mot de passe
    const hashedPassword = await argon2.hash(password);

    // Génération d'un token unique pour la vérification de l'email
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    // Création du nouvel utilisateur dans la base de données
    await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      emailVerificationToken,
      emailVerified: false, // par défaut, l'email n'est pas vérifié
    });

    // Réponse de succès
    return res.status(201).json({
      message: "Utilisateur enregistré avec succès. Veuillez vérifier votre email.",
    });

  } catch (error) {
    // Gestion des erreurs serveur
    console.error("Erreur dans register:", error);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    // On récupère email et password 
    const { email, password } = req.body;

    // Vérification que les champs sont fournis
    if (!email || !password) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires" });
    }

    // Recherche de l'utilisateur dans la base de données
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    // Vérification que l'email est confirmé
    if (!user.emailVerified) {
      return res.status(403).json({ message: "Veuillez vérifier votre email avant de vous connecter" });
    }

    // Vérification du mot de passe
    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    // Création d'un token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },          
      { expiresIn: process.env.JWT_EXPIRES_IN || '3h' } 
    );

    // Réponse avec le token
    res.json({ token });

  } catch (error) {
     console.error("Erreur dans login:", error);
    res.status(500).json({ message: error.message });
  }
};