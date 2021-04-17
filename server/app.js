import express from 'express';
import route from './route';
import cors from 'cors';
import logger from '../logger/logger';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/', (req, res, next) => {
  logger.info('IN SERVER');
  // logger.info(req.url, req.query, req.body, req.headers);
  next();
  // setTimeout(next, 2000);
});
app.use('/', route);

export default app;
