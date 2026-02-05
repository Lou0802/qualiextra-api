import { User } from '../models/user.model.js';
import { isTempEmail } from '../utils/tempEmail.js';
import argon2 from 'argon2';
import crypto from 'crypto';

export const getMyProfile = async (req, res) => {

    const user = await User.findByPk(req.user.id,{
        attributes: { exclude: ['password',] },
    });
    res.json(user);
    };

export const updateMyProfile = async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        if (email && email !== user.email) {
            if (isTempEmail(email)) {
                return res.status(400).json({ message: "Les adresses email temporaires sont interdites" });
            }
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(409).json({ message: "L'email est déjà utilisé" });
            }
            user.email = email;
            user.emailVerified = false;
            user.emailVerificationToken = crypto.randomBytes(32).toString('hex');
        }

        user.firstname = firstname || user.firstname;
        user.lastname = lastname || user.lastname;

        if (password) {
            user.password = await argon2.hash(password);
        }

        await user.save();
        res.json({ message: "Profil mis à jour avec succès" });
    } catch (error) {
        console.error("Erreur dans updateMyProfile:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

    export const getAllUsers =async (req,res)=>{
        const users =await User.findAll({
            attributes: {exclude: ['password']},
        });
        res.json(users);
    };

    export const getUserById = async (req,res)=>{
        const user = await User.findByPk(req.params.id,{
            attributes: { exclude: ['password'] },
        });
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        res.json(user);
    };

    export const updateUser = async (req,res)=>{
        const {firstname,lastname,email,role,password}= req.body;
        const user =await User.findByPk (req.params.id);
        if(!user){
            return res.status(404).json({message:"Utilisateur non trouvé"});
        }

        if (email && email !== user.email) {
            if (isTempEmail(email)) {
                return res.status(400).json({ message: "Les adresses email temporaires sont interdites" });
            }
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(409).json({ message: "L'email est déjà utilisé" });
            }
            user.email = email;
            user.emailVerified = false;
            user.emailVerificationToken = crypto.randomBytes(32).toString('hex');
        }

        user.firstname= firstname || user.firstname;
        user.lastname= lastname || user.lastname;

        if (role) {
            const normalizedRole = role.toUpperCase();
            if (!['ADMIN', 'USER'].includes(normalizedRole)) {
                return res.status(400).json({ message: "Rôle invalide" });
            }
            user.role = normalizedRole;
        }

        if (password) {
            user.password = await argon2.hash(password);
        }

        await user.save();
        res.json({message:"Utilisateur mis à jour avec succès"});
    };

    export const deleteUser = async (req,res)=>{
        const user =await User.findByPk(req.params.id);
        if (!user){
            return res.status(404).json({message:"Utilisateur non trouvé"});
        }
        await user.destroy();
        res.json({message:"Utilisateur supprimé avec succès"});
    };


        

