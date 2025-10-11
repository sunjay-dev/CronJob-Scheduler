import "dotenv/config";
import connectDB from './config/db.config.js';
import http from "http";
import client from "prom-client";

const register = new client.Registry();
client.collectDefaultMetrics({ register });
connectDB();

import agenda from "./agenda/agenda.js";
import "./agenda/jobs/httpRequest.job.js";

async function startAgenda() {
  console.log("Job runner Started.");
  await agenda.start();
}

startAgenda();

http.createServer(async (req, res) => {
  if (req.url === "/metrics") {

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ message: "Missing or invalid Authorization header" }));
      return;
    }

    const token = authHeader.split(" ")[1];
    if (token !== process.env.PROMETHEUS_SECRET) {
      res.statusCode = 403;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ message: "Missing or invalid Authorization header" }));
      return;
    }
    res.setHeader("Content-Type", register.contentType);
    res.end(await register.metrics());
  } else {
    res.writeHead(404);
    res.end();
  }
}).listen(process.env.PORT || 3002, () => {
  console.log("Job Runner metrics server running on port 3002");
});