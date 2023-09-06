import express, { Express } from 'express';
import 'express-async-errors';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes';
import { handleError } from './middlewares/errorHandler';
import config from './config';
import { connectToDatabase } from './models';

const app: Express = express();

function useMiddlewares(): void {
  app.use(cors());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(morgan('common'));
  app.use(routes);
  app.use(handleError);
}

function runApp(): void {
  app.listen(config.server.port, () => {
    console.log('Server is running on port ' + config.server.port);
  });
}

connectToDatabase()
  .then(() => {
    useMiddlewares();
    runApp();
  })
  .catch((error) => {
    console.error('Failed to initialize the application:', error);
    process.exit(1);
  });