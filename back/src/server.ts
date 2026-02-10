import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { env } from './config/env.js';
import { appRouter } from './routes/index.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api', appRouter);

app.listen(env.PORT, () => {
  console.log(`API online em http://localhost:${env.PORT}`);
});
