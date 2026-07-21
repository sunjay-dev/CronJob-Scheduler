import client from "prom-client";
import env from "./env.config.js";

const register = new client.Registry();
register.setDefaultLabels({ job: env.APP_JOB_NAME });
client.collectDefaultMetrics({ register });

export default register;
