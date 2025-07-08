import 'dotenv/config';
import express from "express";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());

import userRouter from './routes/user.routes'
import cronRouter from './routes/cron.routes'
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
    await agenda.start()
    app.listen(port, () => console.log('Server running on Port', port));
}

start();