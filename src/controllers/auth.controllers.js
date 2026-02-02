import  {User} from '../models/user.model.js';
import argon2 from'argon2';
import crypto from 'crypto';

export const register = async(req,res) => {
    try
    {
const {firstname, lastname, email, password } = req.body;

if (!firstname || !lastname || !email || !password)
{
    return res.status(400).json ({message: "tous les champs sont obligatoires"});
}

const existingUser = await User.findOne ({where: {email}});
if (existingUser)
{
    return res.status(409).json ({message: "L'email est déjà utilisé"});
}

const hashedPassword = await argon2.hash(password);

const emailVerificationToken = crypto.randomBytes(32).toString('hex');

const newUser = await User.create({
    firstname,
    lastname,
    email,
    password: hashedPassword,
    emailVerificationToken,
    emailVerified: false,
});

return res.status(201).json ({
    message: "Utilisateur enregistré avec succès. Veuillez vérifier votre email.",
   
});
    } catch (error) {  // ← catch doit être **en dehors** du try
        console.error("Erreur dans register:", error);
        res.status(500).json({ message: error.message });
    }
};