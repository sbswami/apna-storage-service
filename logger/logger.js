import log4js from 'log4js';
import dotenv from 'dotenv';
dotenv.config();
log4js.configure({
  appenders: {
    console: {
      type: 'stdout',
      layout: {
        type: 'pattern',
        pattern: '%d{yyyy-MM-dd hh:mm:ss.SSS %p %c %m',
      },
    },
    file: {
      type: 'file',
      filename: `${process.env.APP_NAME}.log`,
      maxLogSize: 10485760,
      compress: true,
    },
  },
  categories: {
    default: {
      appenders: ['file'],
      level: 'debug',
    },
  },
});
const logger = log4js.getLogger();
export default logger;
