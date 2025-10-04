import cors from 'cors';
import express from 'express';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());

import emailRoutes from './router/email.router'
app.use('/', emailRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Worker listening on port ${PORT}`);
});