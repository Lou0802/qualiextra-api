import express from 'express';
import router from './routes/auth.route.js';
import privateRoute from './routes/private.route.js';
import usersRoute from './routes/user.route.js';

const app =express();

app.use(express.json());

app.use('/api/auth', router);

app.use('/api', privateRoute);

app.use('/api/users', usersRoute);


//route de test de fonctionnement du serveur
app.get ("/health", (req,res) => {
    res.status (200).send ("status ok");
});




export default app;
