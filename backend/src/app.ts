import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import passport from "./config/passport.config.js";
import errorHandler from "./middlewares/errorHandler.middlewares.js";
import { requestLogger } from "./middlewares/requestLogger.middlewares.js";
import routes from "./api.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.join(__dirname, "../public");

const app = express();

app.use(helmet());
app.use(requestLogger);
app.use(passport.initialize());
app.use(express.json());
app.use(cookieParser());
app.use(express.static(clientDistPath));

app.use("/api/v1", routes);

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
