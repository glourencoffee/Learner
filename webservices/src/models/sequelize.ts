import { Sequelize } from 'sequelize';
import config from '../config';

const sequelize = new Sequelize(
  config.db.database,
  config.db.username,
  config.db.password,
  {
    host: config.db.host,
    dialect: 'mysql'
  }
);

/**
 * Establishes the connection to the database.
 * 
 * @throws An exception if connection fails.
 */
export async function connectToDatabase() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
  }
  catch (e) {
    console.error(`Unable to connect to database '${config.db.database}' at '${config.db.host}'.`);
    throw e;
  }
}

export default sequelize;