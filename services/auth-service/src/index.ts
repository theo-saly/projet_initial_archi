import express from 'express';
import authRouter from './routes/auth';

const app = express();

app.use(express.json());

app.use('/auth', authRouter);

app.listen(3001, () => console.log('Auth service listening on port 3001'));
