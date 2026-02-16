import express from "express";
import cors from 'cors';
import authRoute from "./routes/auth.route.js";
import privateRoute from "./routes/private.route.js";
import usersRoute from "./routes/user.route.js";
import path from "path";
import { fileURLToPath } from "url";
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';

const app = express(); 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* middlewares */
app.use(cors());
app.use(express.json());

/* servir le front */
app.use(express.static(path.join(__dirname, "public")));

/* routes API */
app.use("/api/auth", authRoute);
app.use("/api/private", privateRoute);
app.use("/api/users", usersRoute);

/* Swagger UI */
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* route de test */
app.get("/health", (req, res) => {
  res.status(200).send("status ok");
});

export default app;