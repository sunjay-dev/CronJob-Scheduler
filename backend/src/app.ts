import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import passport from "./config/passport.config.js";
import errorHandler from "./middlewares/errorHandler.middlewares.js";
import { requestLogger } from "./middlewares/requestLogger.middlewares.js";
import routes from "./api.routes.js";
import { serveFrontend } from "./static/serveFrontend.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.join(__dirname, "../public");

const app = express();

app.set("trust proxy", true);

app.use(helmet());
app.use(requestLogger);
app.use(passport.initialize());
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", routes);

serveFrontend(app, clientDistPath);

app.use(errorHandler);

export default app;
