import { Agenda } from "agenda";
import env from "../config/env.config.js";

const agenda = new Agenda({
  db: {
    address: env.MONGO_DB_URI,
    collection: env.MONGO_DB_COLLECTION,
  },
  processEvery: "5 seconds",
});

export default agenda;
