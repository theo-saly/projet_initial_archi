import express from 'express';
import db from './persistence';
import routes from './routes/routes';
import authRouter from './routes/auth';

const app = express();

app.use(express.json());
app.use(express.static(__dirname + '/static'));

app.use('/auth', authRouter);

routes(app);

db.init()
    .then(() => {
        app.listen(3000, () => console.log('Listening on port 3000'));
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });

const gracefulShutdown = () => {
    db.teardown()
        .catch(() => {})
        .then(() => process.exit());
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('SIGUSR2', gracefulShutdown);
