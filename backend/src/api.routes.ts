import { type Router, Router as createRouter } from "express";

import serverRouter from "./routes/server.routes.js";
import userRouter from "./routes/user.routes.js";
import cronRouter from "./routes/log.routes.js";
import jobRouter from "./routes/job.routes.js";

const router: Router = createRouter();

router.use("/", serverRouter);
router.use("/user", userRouter);
router.use("/logs", cronRouter);
router.use("/jobs", jobRouter);

export default router;
