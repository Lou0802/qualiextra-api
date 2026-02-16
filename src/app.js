import express from "express";
import cors from 'cors';
import router from "./routes/auth.route.js";
import privateRoute from "./routes/private.route.js";
import usersRoute from "./routes/user.route.js";
import path from "path";
import { fileURLToPath } from "url";
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';

const app = express(); 

/* nécessaire en ES modules */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* middlewares */
app.use(express.json());
/* CORS: autorise l'origine définie dans BASE_URL ou localhost:3000 */
const corsOptions = {
  origin: process.env.BASE_URL || 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions));

/* servir le front */
app.use(express.static(path.join(__dirname, "public")));

/* routes API */
app.use("/api/auth", router);
app.use("/api", privateRoute);
app.use("/api", usersRoute);
/* Swagger UI */
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* route de test */
app.get("/health", (req, res) => {
  res.status(200).send("status ok");
});

export default app;