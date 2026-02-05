import { User } from '../models/user.model.js';

export const isAdmin =async (req,res,next)=>{
    
  if (req.user.role !== 'ADMIN') {
         return res.status(403).json({ message: "Accès refusé : privilèges administrateur requis" });
       }
       next();
           
};  