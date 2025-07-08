import 'dotenv/config';
import express from "express";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());

import userRouter from './routes/user.routes'
import cronRouter from './routes/cron.routes'
app.use('/', userRouter);
app.use('/api', cronRouter);


import connectDB from './config/db.config'
import agenda from './agenda/agenda';
import './agenda';

const port = process.env.PORT || 3000;

(async () => {
    await connectDB();
    await agenda.start()
    app.listen(port, () => console.log('Server running on Port', port));
})();