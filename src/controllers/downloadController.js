import {badRequest} from '../utils/errorHandling';
import fs from 'fs-extra';
import {C} from '../utils/constants';

export const downloadController = async (req, res) => {
  try {
    // Directory of given path
    const dirPath = `${process.env.ROOT}/${req.query[C.PATH]}`;

    // List of all file in dir
    const list = await fs.readdir(dirPath);

    // Get full file name with extension
    const fileName = list.find(item => item.includes(req.query[C.TYPE]));

    // Path of the file
    const path = `${dirPath}/${fileName}`;

    // Read stream source
    const src = fs.createReadStream(path);

    // stream the file
    src.pipe(res);
  } catch (error) {
    badRequest(error, res);
  }
};
