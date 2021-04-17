import express from 'express';
import multer from 'multer';
import {downloadController} from '../controllers/downloadController';
import {streamFile} from '../controllers/streamController';
import {uploadFile} from '../controllers/uploadController';
import {verifyKey} from '../middlewares/middleware';

const fileRouter = express.Router();

const upload = multer();

// Upload handler
var fileWithThumbnail = upload.fields([
  {name: 'file', maxCount: 1},
  {name: 'thumbnail', maxCount: 1},
]);

// Each route has verify key middleware, can remove if want to access publicly
fileRouter.post('/upload', verifyKey, fileWithThumbnail, uploadFile);
fileRouter.get('/stream', verifyKey, streamFile);
fileRouter.get('/', verifyKey, downloadController);

export default fileRouter;
