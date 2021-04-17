import {videoSaver} from '../helper/videoSaver';
import {C, FileName, FileType} from '../utils/constants';
import {badRequest} from '../utils/errorHandling';
import {fileNameWithoutExtension} from '../utils/util';

const fs = require('fs-extra');
const {promisify} = require('util');
const pipeline = promisify(require('stream').pipeline);

export const uploadFile = async (req, res) => {
  try {
    // Upload File
    const {
      files,
      body: {type},
    } = req;

    // File
    const file = files?.file[0];

    // Thumbnail
    const thumbnail = files?.thumbnail[0];

    // Get file name
    const fileName = fileNameWithoutExtension(file.originalName);

    // File Extension
    const fileExtension = file.detectedFileExtension;

    // File level directory
    const filePath = `${process.env.ROOT}/${req.get(
      C.USER_ID,
    )}/${type}/${fileName}`;

    // Create new directory
    await fs.mkdir(filePath, {recursive: true});

    const finalPath = `${filePath}/${FileName.MAIN}${fileExtension}`;

    // Save file in async way
    await pipeline(file.stream, fs.createWriteStream(finalPath));

    // Save Thumbnail
    if (thumbnail) {
      const thumbnailPath = `${filePath}/${FileName.THUMBNAIL}${thumbnail.detectedFileExtension}`;
      await pipeline(thumbnail.stream, fs.createWriteStream(thumbnailPath));
    }

    // Content is video
    if (FileType.VIDEO === type) {
      // Save video in diff format
      videoSaver(finalPath, fileExtension, sizes => {
        res.status(200).json({
          path: filePath.replace(process.env.ROOT + '/', ''),
          sizes: sizes ?? [],
        });
      });
    }
    // Other then video
    else {
      res.status(200).json({
        path: filePath.replace(process.env.ROOT + '/', ''),
      });
    }
  } catch (error) {
    badRequest(error, res);
  }
};
