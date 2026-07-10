import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import passport from "./config/passport.config.js";
import errorHandler from "./middlewares/errorHandler.middlewares.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.join(__dirname, "../public");

const app = express();

app.use(passport.initialize());
app.use(express.json());
app.use(cookieParser());

import serverRouter from "./routes/server.routes.js";
import userRouter from "./routes/user.routes.js";
import cronRouter from "./routes/log.routes.js";
import jobRouter from "./routes/job.routes.js";

app.use("/api/v1", serverRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/logs", cronRouter);
app.use("/api/v1/jobs", jobRouter);

app.get("/*splat", (req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, "index.html"), (err) => {
    if (err) {
      next();
    }
  });
});

app.use(errorHandler);

export default app;
