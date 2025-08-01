import cors from 'cors';
import express, { Request, Response } from 'express';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
import { router } from './app/routes';
import { notFound } from './app/middlewares/notFound';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cookieParser())
app.use(express.json());
app.use(cors());

app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: 'Welcome to Tour Management System Backend'
    });
});

// Global Error Handler
app.use(globalErrorHandler);

// NotFound
app.use(notFound);

export default app;
