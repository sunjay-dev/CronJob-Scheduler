import cors from "cors";
import express from "express";
import "dotenv/config";
import env from "./config/env.config.js";

const app = express();
app.use(cors());
app.use(express.json());

import emailRoutes from "./router/email.router.js";
app.use("/", emailRoutes);

app.listen(env.PORT, () => {
  console.log(`Worker listening on port ${env.PORT}`);
});
