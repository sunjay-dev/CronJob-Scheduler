import client from "prom-client";

const register = new client.Registry();
register.setDefaultLabels({ job: process.env.APP_JOB_NAME || "backend" });
client.collectDefaultMetrics({ register });

export default register;
