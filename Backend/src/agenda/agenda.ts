import Agenda from 'agenda'

const agenda = new Agenda({
  db: {
    address: process.env.MONGO_DB_URI!,
    collection: process.env.MONGO_DB_COLLECTION!
  },
  processEvery: "5 second"
});

export default agenda