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
app.use("/api/user", userRouter);
app.use("/api/logs", cronRouter);
app.use("/api/jobs", jobRouter);

app.use(errorHandler);

export default app;
