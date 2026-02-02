import express from 'express';
import router from './routes/auth.routes.js';
const app =express();

app.use(express.json());

app.use('/api/auth', router);

app.get ("/health", (req,res) => {
    res.status (200).send ("status ok");
});




export default app;
