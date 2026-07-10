import { type Request, type Response, Router } from "express";
import { prometheusAuth } from "../middlewares/auth.middlewares.js";
import register from "../config/prometheus.config.js";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.status(200).send(`Hello from my server!`);
});

router.get("/health", (_req: Request, res: Response) => {
  res.status(200).send("OK");
});

router.get("/metrics", prometheusAuth, async (_req: Request, res: Response) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

export default router;
