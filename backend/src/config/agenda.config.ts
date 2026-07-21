import { Agenda } from "agenda";
import env from "./env.config.js";

const agenda = new Agenda({
  db: {
    address: env.MONGO_DB_URI,
    collection: env.MONGO_DB_COLLECTION,
  },
});

export default agenda;
