import express, { Express } from 'express';
import 'express-async-errors';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes';
import { handleError } from './middlewares/errorHandler';
import config from './config';

const app: Express = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(morgan('common'));
app.use(routes);
app.use(handleError);

app.listen(config.server.port, () => {
  console.log('Server is running at http://localhost:' + config.server.port);
});