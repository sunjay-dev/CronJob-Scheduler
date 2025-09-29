import "dotenv/config";
import connectDB from './config/db.config.js';
connectDB();

import agenda from "./agenda/agenda.js";
import "./agenda/jobs/httpRequest.job.js";

async function startAgenda() {
  console.log("Job runner Started.");
  await agenda.start();
}

startAgenda();