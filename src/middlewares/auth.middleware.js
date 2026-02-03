import jwt from 'jsonwebtoken';

//vérifie si l'utilisateur est authentifié
export const isAuthenticated = (req, res, next) => {
    try {
         // Récupère le header Authorization de la requête HTTP
        // Format attendu : "Bearer <TOKEN>"
        const authHeader = req.headers.authorization;
         // Si le header Authorization est absent, l'utilisateur n'est pas authentifié
        if (!authHeader) {
            return res.status(401).json({ message: "Token d'authentification manquant" });
        }
        // Extraction du token depuis le header Authorization
        // Exemple : "Bearer abc.def.ghi" → on récupère seulement "abc.def.ghi"
        const token = authHeader.split(' ')[1];
        try {
            // Vérification et décodage du token avec la clé secrète
            // Si le token est valide, jwt.verify retourne les données encodées
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // Stocke les informations utilisateur dans la requête
            req.user = decoded;
            next();
        } catch (err) {
           // Si le token est invalide ou expiré  
            return res.status(401).json({ message: "Token d'authentification invalide" });
        }
    } catch (error) {
        console.error("Erreur dans isAuthenicated:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
    };