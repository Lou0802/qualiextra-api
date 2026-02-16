import { User } from '../models/user.model.js';
import argon2 from 'argon2';

// On importe crypto pour générer un token de vérification par email
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { isTempEmail } from '../utils/tempEmail.js';
import { sendVerificationEmail } from '../utils/email.js';


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

    // Blocage email temporaire
    if (isTempEmail(email)) {
      return res.status(400).json({
        message: "Les adresses email temporaires sont interdites"
      });
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
    const user = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      emailVerificationToken,
      emailVerified: false, // par défaut, l'email n'est pas vérifié
    });

    await sendVerificationEmail(user.email, emailVerificationToken);

    // [DEV] Log du token pour faciliter les tests (à retirer en production)
    console.log(`[DEV] Token de vérification pour ${user.email}: ${emailVerificationToken}`);

    // Réponse de succès (token inclus en dev pour faciliter les tests Swagger)
    return res.status(201).json({
      message: "Utilisateur enregistré avec succès. Veuillez vérifier votre email.",
      // [DEV] À retirer en production :
      emailVerificationToken: emailVerificationToken,
    });

  } catch (error) {
    // Gestion des erreurs serveur
    console.error("Erreur dans register:", error);
    res.status(500).json({ message: error.message });
  }
};
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
  const user = await User.findOne({
    where: { emailVerificationToken: token }
  });
  if (!user) {
    return res.status(400).json({ message: "Token de vérification invalide" });
  }
  user.emailVerified = true;
  user.emailVerificationToken = null; // Invalide le token après vérification
  await user.save();
  res.json({ message: "Email vérifié avec succès" });
  } catch (error) {
    console.error("Erreur dans verifyEmail:", error);
    res.status(500).json({ message: "Erreur serveur" });
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
      process.env.JWT_SECRET,         
      { expiresIn: process.env.JWT_EXPIRES_IN || '3h' } 
    );

    // Réponse avec le token
    res.json({ token });

  } catch (error) {
     console.error("Erreur dans login:", error);
    res.status(500).json({ message: error.message });
  }
};