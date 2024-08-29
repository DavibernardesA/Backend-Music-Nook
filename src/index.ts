import { env } from './application/config/env/env';
import logger from './application/config/logs/logger';
import app from './app';
import { AppDataSource } from './domain/infraestructure/data-source';

const port = env.PORT;
const url = `http://localhost:${port}/`;

AppDataSource.initialize()
  .then(() => {
    logger.info('Data Source has been initialized!');
    app.listen(port, () => {
      logger.info(`Server listening on port ${port}... Access the server at this link: ${url}.`);
    });
  })
  .catch(err => {
    logger.error('Error during Data Source initialization.', err);
  });
