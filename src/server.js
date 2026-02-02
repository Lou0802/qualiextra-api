import "dotenv/config";
import app from "./app.js";
import { sequelize } from "./config/database.js";
import { User } from "./models/user.model.js";

const PORT = process.env.PORT || 3000;

export async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Connexion à la base de données réussie.');

        await sequelize.sync();
        console.log('Modèles synchronisés avec la base de données.');

        app.listen(PORT, () => {
            console.log(`Server sur le port: ${PORT}`);
        });
    } catch (error) {
        console.error('Impossible de se connecter à la base de données:', error);
    }
} 

startServer(); 