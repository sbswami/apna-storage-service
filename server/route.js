import express from 'express';
import fileRouter from '../src/routes/fileRoutes';
const router = express.Router();

router.get('/', (_, res) => res.send('<h1>Apna Storage</h1>'));

router.use('/file', fileRouter);

export default router;
