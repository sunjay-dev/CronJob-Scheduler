require("dotenv").config();

const agenda = require("./agenda/agenda");
require("./agenda/jobs");

async function startAgenda() {
  await agenda.start();
}

startAgenda();