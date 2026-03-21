import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "./config/passport.config.js";
import errorHandler from "./middlewares/errorHandler.middlewares.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL as string,
    credentials: true,
    maxAge: 7200,
  }),
);

app.use(passport.initialize());
app.use(express.json());
app.use(cookieParser());

import serverRouter from "./routes/server.routes.js";
import userRouter from "./routes/user.routes.js";
import cronRouter from "./routes/log.routes.js";
import jobRouter from "./routes/job.routes.js";

app.use("/", serverRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/logs", cronRouter);
app.use("/api/v1/jobs", jobRouter);

app.use(errorHandler);

export default app;
