import express, {Express} from 'express';
import cookies from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import { rateLimit } from 'express-rate-limit';
import route from './routes';
import { sequelize } from './config';
import { notFound, errorHandler } from './middlewares';

dotenv.config();
const app: Express = express();

/***********************Config************************/
app.set('trust proxy', 1);
app.use('/api', rateLimit({
    max: 1000,
    windowMs: 60 * 60 * 1000,
    message: 'You made too many requests in 1 hour.',
    standardHeaders: true,
    legacyHeaders: false,
}));
app.use(helmet());
app.use(express.json({limit: '10kb'}));
app.use(express.urlencoded({extended: true, limit: '10kb'}));
app.use(cors({
    origin: [
        'http://localhost:3000',
    ],
    credentials: true
}));
app.use(cookies(process.env.COOKIE_SECRET));

if(process.env.NODE_ENV !== 'test') {
    app.use(morgan('common'));
}

/**********************Connect************************/
route(app);
app.use(notFound);
app.use(errorHandler);
/****************************************************/

const port: number = process.env.PORT ? parseInt(process.env.PORT) : 5000;

app.listen(port, async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({alter: true});
        console.log('Connection has been established successfully.');
        console.log(`Server listening on ${port}`);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});

export default app;