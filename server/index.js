import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import app from './app';

app.set('port', process.env.PORT);
const server = http.createServer(app);

server.listen(process.env.PORT);
server.on('error', onError);

server.on('listening', () =>
  // eslint-disable-next-line no-console
  console.log(`Started Listening at ${process.env.PORT}`),
);

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
}
