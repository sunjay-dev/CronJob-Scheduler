import { Agenda } from "agenda";

const agenda = new Agenda({
  db: {
    address: process.env.MONGO_DB_URI as string,
    collection: process.env.MONGO_DB_COLLECTION as string,
  },
});

export default agenda;
