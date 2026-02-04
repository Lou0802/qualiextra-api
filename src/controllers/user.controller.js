import { User } from '../models/user.model.js';

export const getMyProfile = async (req, res) => {

    const user = await User.findByPk(req.user.id,{
        attributes: { exclude: ['password',] },
    });
    res.json(user);
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
        const {firstname,lastname,email,role}= req.body;
        const user =await User.findByPk (req.params.id);
        if(!user){
            return res.status(404).json({message:"Utilisateur non trouvé"});
        }
        user.firstname= firstname || user.firstname;
        user.lastname= lastname || user.lastname;
        user.email= email || user.email;
        user.role= role || user.role;

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


        

