import 'dotenv/config';
import express from "express";
import cookieParser from "cookie-parser";
import cors from 'cors';

const app = express();
app.use(cors({
    origin: process.env.CLIENT_URL!,
  credentials: true,  
}));
app.use(express.json());
app.use(cookieParser());

import userRouter from './routes/user.routes'
import cronRouter from './routes/log.routes'
import jobRouter from './routes/job.routes'

app.use('/', userRouter);
app.use('/api/logs', cronRouter);
app.use('/api/jobs', jobRouter);


import connectDB from './config/db.config'
import agenda from './agenda/agenda';
import './agenda';

const port = process.env.PORT || 3000;

async function start() {
    await connectDB();
    await agenda.start();

    await agenda.every("1 hour", "clean-now-jobs");

    app.listen(port, () => console.log('Server running on Port', port));
}

start();