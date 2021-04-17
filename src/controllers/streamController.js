import {badRequest} from '../utils/errorHandling';
import fs from 'fs-extra';
import {C, FileName} from '../utils/constants';

export const streamFile = async (req, res) => {
  try {
    // Directory path of given path
    const folderPath = `${process.env.ROOT}/${req.query[C.PATH]}`;

    // List of all files from that dir
    const list = await fs.readdir(folderPath);

    // Select any file to get extension
    const anyVideo = list.find(item => !item.includes(FileName.THUMBNAIL));

    // Extension of the file
    const extension = `.${anyVideo.substring(anyVideo.lastIndexOf('.') + 1)}`;

    // Path of main video file
    let path = `${folderPath}/${FileName.MAIN}${extension}`;

    // If main file is still exist, means video is not save in different qualities, so stream main video
    if (!fs.existsSync(path)) {
      // If quality specified in query
      if (req.query[C.QUALITY]) {
        // Path with  quality video
        path = `${folderPath}/${req.query[C.QUALITY]}${extension}`;
      } else {
        // Default video selected 144p
        let defaultVideo = 144;
        let qualityIndex;

        list.forEach((item, index) => {
          // If Thumbnail continue to next item
          if (item.includes(FileName.THUMBNAIL)) {
            return;
          }

          // quality in Number
          const itemQuality = Number(item.substring(0, item.indexOf('p')));

          // Check till best quality
          if (itemQuality > defaultVideo) {
            defaultVideo = itemQuality;
            qualityIndex = index;
          }
        });

        // Path to best quality video
        path = `${folderPath}/${list[qualityIndex]}`;
      }
    }

    // Stat data of video
    const stat = fs.statSync(path);

    // Size of file
    const fileSize = stat.size;

    // Range specified in request headers
    const range = req.headers.range;

    // Range from request
    if (range) {
      // Split the string in 2 parts
      const parts = range.replace(/bytes=/, '').split('-');

      // Starting point of Chunk
      const start = parseInt(parts[0], 10);

      // End point of chunk
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      // If start point if greater then complete file size
      if (start >= fileSize) {
        // Out of range
        res
          .status(416)
          .send(
            'Requested range not satisfiable\n' + start + ' >= ' + fileSize,
          );
        return;
      }

      // Chunk size
      const chunkSize = end - start + 1;

      // Read stream only for chunk size
      const file = fs.createReadStream(path, {start, end});

      // Response head
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4',
      };

      // Res head with 206, request back for next content
      res.writeHead(206, head);

      // Send file chunk stream
      file.pipe(res);
    } else {
      // With complete file
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };

      // Response with entire file
      res.writeHead(200, head);

      // Read stream and response with entire file
      fs.createReadStream(path).pipe(res);
    }
  } catch (error) {
    badRequest(error, res);
  }
};
