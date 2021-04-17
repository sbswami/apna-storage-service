import logger from '../../logger/logger';
import {getFilePath} from '../utils/util';
import fs from 'fs-extra';

const ffmpeg = require('fluent-ffmpeg');

export const videoSaver = async (finalPath, extension, getSizes) => {
  // Get file metadata
  ffmpeg.ffprobe(finalPath, function (err, metadata) {
    // Log error and exit the flow
    if (err) {
      getSizes();
      return logger.error(err);
    }

    // Video Size
    const width = metadata.streams[0].width;
    const height = metadata.streams[0].height;

    // Video out put sizes
    const sizes = videoSized(width, height, finalPath, extension);

    // Call back with sizes will be created
    getSizes(sizes.map(item => item.sizeName));

    // ffmpeg command
    const command = ffmpeg(finalPath);

    // For each possible sizes
    sizes.forEach(item => {
      try {
        // Output configuration of each video
        command.output(item.filename).videoCodec('libx264').size(item.size);
      } catch (e) {
        logger.error(e.message);
      }
    });

    command
      .on('error', function (err) {
        logger.error('Error in file saving ' + err.message + '\n' + finalPath);
      })
      // .on('progress', function (progress) {
      //  videos are saving
      // })
      .on('end', async function () {
        // Delete the file after complete saving files
        // Because original size is also compressed in this process
        await fs.unlink(finalPath);
      })
      .run();
  });
};

// Video file sizes and names
const videoSized = (width, height, fullPath, extension) => {
  const path = getFilePath(fullPath);

  const sizes = [];
  // Video Orientation
  const horizontal = width > height;

  // If video is Horizontal
  if (horizontal) {
    // original size video
    sizes.push({
      filename: `${path}/${height}p${extension}`,
      size: `${width}x${height}`,
      sizeName: `${height}p`,
    });

    // If original size is higher then 1080
    if (height > 1080) {
      sizes.push({
        filename: `${path}/1080p${extension}`,
        size: '?x1080',
        sizeName: '1080p',
      });
    }

    // If original size is higher then 720
    if (height > 720) {
      sizes.push({
        filename: `${path}/720p${extension}`,
        size: '?x720',
        sizeName: '720p',
      });
    }

    // If original size is higher then 480
    if (height > 480) {
      sizes.push({
        filename: `${path}/480p${extension}`,
        size: '?x480',
        sizeName: '480p',
      });
    }

    // If original size is higher then 144
    if (height > 144) {
      sizes.push({
        filename: `${path}/144p${extension}`,
        size: '?x144',
        sizeName: '144p',
      });
    }
  }

  // If video is vertical
  else {
    // original size video
    sizes.push({
      filename: `${path}/${width}p${extension}`,
      size: `${width}x${height}`,
      sizeName: `${width}p`,
    });

    // If original size is higher then 1080
    if (width > 1080) {
      sizes.push({
        filename: `${path}/1080p${extension}`,
        size: '1080x?',
        sizeName: '1080p',
      });
    }

    // If original size is higher then 720
    if (width > 720) {
      sizes.push({
        filename: `${path}/720p${extension}`,
        size: '720x?',
        sizeName: '720p',
      });
    }

    // If original size is higher then 480
    if (width > 480) {
      sizes.push({
        filename: `${path}/480p${extension}`,
        size: '480x?',
        sizeName: '480p',
      });
    }

    // If original size is higher then 144
    if (width > 144) {
      sizes.push({
        filename: `${path}/144p${extension}`,
        size: '144x?',
        sizeName: '144p',
      });
    }
  }

  return sizes;
};
