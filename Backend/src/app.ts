import 'dotenv/config';
import express from "express";
import cookieParser from "cookie-parser";
import cors from 'cors';
import passport from "./config/passport.config";
import errorHandler  from './middlewares/errorHandler.middlewares';

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL!,
  credentials: true,
}));

app.use(passport.initialize());
app.use(express.json());
app.use(cookieParser());

import userRouter from './routes/user.routes'
import cronRouter from './routes/log.routes'
import jobRouter from './routes/job.routes'

app.use('/', userRouter);
app.use('/api/logs', cronRouter);
app.use('/api/jobs', jobRouter);

app.use(errorHandler);

import connectDB from './config/db.config'

const port = process.env.PORT || 3000;
import logger from './utils/logger.utils';

async function start() {
  await connectDB();
  app.listen(port, () => logger.info(`Server running on Port ${port}`));
}

start();