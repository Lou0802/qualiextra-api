import express from "express";
import router from "./routes/auth.route.js";
import privateRoute from "./routes/private.route.js";
import usersRoute from "./routes/user.route.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express(); 

/* nécessaire en ES modules */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* middlewares */
app.use(express.json());

/* servir le front */
app.use(express.static(path.join(__dirname, "public")));

/* routes API */
app.use("/api/auth", router);
app.use("/api", privateRoute);
app.use("/api", usersRoute);

/* route de test */
app.get("/health", (req, res) => {
  res.status(200).send("status ok");
});

export default app;